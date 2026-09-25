import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";

const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ owner: req.user._id }).populate(
    "items.product",
    "name price thumbnail"
  );

  if (!wishlist) {
    // If a user has no wishlist yet, return an empty one for a consistent frontend experience
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Wishlist is empty"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

const addOrRemoveFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find user's wishlist, or create one if it doesn't exist
  let wishlist = await Wishlist.findOne({ owner: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ owner: userId, items: [] });
  }

  const productIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === productId
  );

  let message = "";
  if (productIndex > -1) {
    // Product exists in wishlist, so remove it
    wishlist.items.splice(productIndex, 1);
    message = "Product removed from wishlist";
  } else {
    // Product does not exist, so add it
    wishlist.items.push({ product: productId });
    message = "Product added to wishlist";
  }

  await wishlist.save();

  // Fetch the updated wishlist with populated product details
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.product",
    "name price thumbnail"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWishlist, message));
});

export { getUserWishlist, addOrRemoveFromWishlist };