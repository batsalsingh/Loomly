import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has only one cart
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);