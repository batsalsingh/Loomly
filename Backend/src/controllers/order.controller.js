import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const buildShippingInfo = (shippingInfo, metadata) => ({
  address: shippingInfo?.address || metadata?.shippingAddress,
  city: shippingInfo?.city || metadata?.shippingCity,
  state: shippingInfo?.state || metadata?.shippingState,
  country: shippingInfo?.country || metadata?.shippingCountry,
  pinCode: shippingInfo?.pinCode || metadata?.shippingPinCode,
});

const finalizeOrderFromCheckoutSession = async (checkoutSession, shippingInfo) => {
  if (!checkoutSession || checkoutSession.payment_status !== "paid") {
    throw new ApiError(400, "Payment is not complete");
  }

  const userId = checkoutSession.metadata?.userId;
  const cartId = checkoutSession.metadata?.cartId;
  const resolvedShippingInfo = buildShippingInfo(shippingInfo, checkoutSession.metadata);
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(cartId)) {
    throw new ApiError(400, "Payment metadata is invalid");
  }
  if (Object.values(resolvedShippingInfo).some((value) => !value)) {
    throw new ApiError(400, "Shipping information is required");
  }

  const dbSession = await mongoose.startSession();
  try {
    let createdOrder;
    await dbSession.withTransaction(async () => {
      const existingOrder = await Order.findOne({ "paymentInfo.id": checkoutSession.id }).session(dbSession);
      if (existingOrder) {
        createdOrder = existingOrder;
        return;
      }

      const cart = await Cart.findOne({ _id: cartId, owner: userId })
        .populate("items.product", "name price thumbnail variants")
        .session(dbSession);
      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
      }

      let totalPrice = 0;
      const orderItems = [];
      for (const item of cart.items) {
        if (!item.product) {
          throw new ApiError(404, "A product in your cart could not be found");
        }
        totalPrice += item.product.price * item.quantity;
        orderItems.push({
          name: item.product.name,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
          image: item.product.thumbnail?.url || "https://via.placeholder.com/150?text=No+Image",
          product: item.product._id,
        });
      }

      if (
        checkoutSession.currency !== "inr" ||
        checkoutSession.amount_total !== Math.round(totalPrice * 100) ||
        checkoutSession.metadata?.cartId !== cart._id.toString()
      ) {
        throw new ApiError(400, "Payment does not match this order");
      }

      for (const item of cart.items) {
        const hasVariants = item.product.variants?.length > 0;
        const stockFilter = hasVariants
          ? { _id: item.product._id, variants: { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } } }
          : { _id: item.product._id, stock: { $gte: item.quantity } };
        const stockUpdate = hasVariants
          ? { $inc: { "variants.$.stock": -item.quantity, stock: -item.quantity } }
          : { $inc: { stock: -item.quantity } };
        const result = await Product.updateOne(stockFilter, stockUpdate).session(dbSession);
        if (result.modifiedCount !== 1) {
          throw new ApiError(409, `Not enough stock for ${item.product.name}`);
        }
      }

      [createdOrder] = await Order.create([{
        shippingInfo: resolvedShippingInfo,
        orderItems,
        totalPrice,
        owner: userId,
        paymentInfo: { id: checkoutSession.id, status: checkoutSession.payment_status },
        trackingHistory: [{ status: "Processing", timestamp: new Date(), note: "Order placed successfully" }],
      }], { session: dbSession });
      await Cart.deleteOne({ _id: cart._id }).session(dbSession);
    });
    return createdOrder;
  } finally {
    await dbSession.endSession();
  }
};

const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, paymentInfo } = req.body;
  if (!paymentInfo?.id || !stripe) {
    throw new ApiError(400, "A valid payment is required");
  }
  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.retrieve(paymentInfo.id);
  } catch {
    throw new ApiError(400, "Payment could not be verified");
  }

  if (checkoutSession.metadata?.userId !== req.user._id.toString()) {
    throw new ApiError(400, "Payment does not belong to this user");
  }
  const order = await finalizeOrderFromCheckoutSession(checkoutSession, shippingInfo);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});


// --- User-specific routes ---
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Your orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid Order ID");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure the user owns the order or is an admin
  if (order.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// --- Admin-only routes ---
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("owner", "fullName email").sort({createdAt: -1});
  return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
        throw new ApiError(400, "Invalid order status");
    }

    order.orderStatus = status;
    if (status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    // Add to tracking history
    const statusNotes = {
      Processing: "Order is being prepared",
      Shipped: "Order has been shipped and is on its way",
      Delivered: "Order has been delivered successfully",
      Cancelled: "Order has been cancelled",
    };

    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: statusNotes[status] || "Status updated",
    });

    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});


export { createOrder, finalizeOrderFromCheckoutSession, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };