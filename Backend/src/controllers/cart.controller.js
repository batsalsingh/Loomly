import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id }).populate({
    path: "items.product",
    // +++ FIX: Select 'thumbnail' instead of 'productImage' +++
    select: "name price thumbnail stock variants", 
  });

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { cart: { items: [] }, cartTotalPrice: 0 }, "Cart is empty"));
  }

  let cartTotalPrice = 0;
  cart.items.forEach(item => {
    if (item.product) {
      cartTotalPrice += item.product.price * item.quantity;
    }
  });

  return res.status(200).json(new ApiResponse(200, { cart, cartTotalPrice }, "Cart fetched successfully"));
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, size = "Standard" } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    
    // Check specific variant stock if it has variants
    let stockToCheck = product.stock;
    if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(v => v.size === size);
        if (variant) {
            stockToCheck = variant.stock;
        } else {
            throw new ApiError(400, "Selected variant is not available");
        }
    }

    if (stockToCheck < quantity) throw new ApiError(400, "Not enough stock available");

    let cart = await Cart.findOne({ owner: userId });
    if (!cart) {
        cart = await Cart.create({ owner: userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size);

    if (productIndex > -1) {
        // Product already in cart, update quantity
        cart.items[productIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity, size });
    }
    
    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity, size = "Standard" } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId) || !quantity || quantity < 1) {
        throw new ApiError(400, "Valid Product ID and quantity are required");
    }
    
    const cart = await Cart.findOne({ owner: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size);
    if (productIndex === -1) throw new ApiError(404, "Product not in cart");

    cart.items[productIndex].quantity = quantity;
    await cart.save();
    
    return res.status(200).json(new ApiResponse(200, cart, "Cart item quantity updated"));
});


const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params; // Get ID from URL parameter
    const { size = "Standard" } = req.query; // Allow specific variant removal via query
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Match exact variant or just product if size aren't passed
    const matchCondition = { product: productId, size };

    const cart = await Cart.findOneAndUpdate(
        { owner: userId },
        { $pull: { items: matchCondition } },
        { new: true } // Return the updated document
    );

    if (!cart) throw new ApiError(404, "Cart not found or item not in cart");

    return res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

export { getUserCart, addItemToCart, updateCartItemQuantity, removeItemFromCart };