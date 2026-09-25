import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pinCode: { type: Number, required: true },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true }, // Price at the time of order
        image: { type: String, required: true }, // Image URL at the time of order
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentInfo: {
      id: { type: String, required: true, unique: true }, // From payment gateway
      status: { type: String, required: true, default: "Pending" },
    },
    deliveredAt: {
      type: Date,
    },
    trackingHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);