import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const createOrUpdateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  // Optional but recommended: Check if the user has purchased the product
  const hasPurchased = await Order.findOne({
    owner: userId,
    "orderItems.product": productId,
    orderStatus: "Delivered",
  });

  if (!hasPurchased) {
    throw new ApiError(403, "You can only review products you have purchased and received.");
  }
  
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let review = await Review.findOne({ product: productId, user: userId });

  if (review) {
    // Update existing review
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    // Create a new review
    review = await Review.create({
      rating,
      comment,
      product: productId,
      user: userId,
    });
  }

  // --- Update Product's aggregate review data ---
  // Find all reviews for the product to calculate the new average
  const reviews = await Review.find({ product: productId });
  const numOfReviews = reviews.length;
  
  const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
  const averageRating = totalRating / numOfReviews;
  
  product.numOfReviews = numOfReviews;
  product.ratings = averageRating;

  await product.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, review, "Review submitted successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    const reviews = await Review.find({ product: productId }).populate("user", "fullName avatar");
    
    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid Review ID");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if the user owns the review or is an admin
    if (review.user.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    const productId = review.product;
    await review.deleteOne();
    
    // --- Update Product's aggregate review data after deletion ---
    const reviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        product.ratings = totalRating / reviews.length;
        product.numOfReviews = reviews.length;
    } else {
        product.ratings = 0;
        product.numOfReviews = 0;
    }
    
    await product.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { createOrUpdateProductReview, getProductReviews, deleteReview };