// src/routes/product.routes.js

import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductsByCategory,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts, // +++ ADDED +++
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/").get(getAllProducts);
router.route("/id/:productId").get(getProductById);
router.route("/style/:styleSlug").get(getProductsByCategory);
router.route("/related/:productId").get(getRelatedProducts); // +++ ADDED: Route for related products +++

// --- Admin Only Routes ---
router
  .route("/create")
  // --- MODIFIED: Use .array() to accept multiple images ---
  .post(verifyJWT, verifyAdmin, upload.array("productImages", 10), createProduct);

router
  .route("/:productId")
  .patch(verifyJWT, verifyAdmin, updateProduct)
  .delete(verifyJWT, verifyAdmin, deleteProduct);

export default router;