import mongoose, { Schema } from "mongoose";

const wishlistItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const wishlistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has only one wishlist
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);