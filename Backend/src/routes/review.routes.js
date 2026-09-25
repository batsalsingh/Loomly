import { Router } from "express";
import {
  createOrUpdateProductReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route to get all reviews for a product
router.route("/product/:productId").get(getProductReviews);

// Protected routes
router.use(verifyJWT);

router.route("/").post(createOrUpdateProductReview);
router.route("/:reviewId").delete(deleteReview);

export default router;