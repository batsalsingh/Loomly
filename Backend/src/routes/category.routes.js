import { Router } from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public route to get all categories
router.route("/").get(getAllCategories);

// Secured route to create a new category (admin only)
// Note: We'd add an `isAdmin` middleware here in a real app
router.route("/create").post(verifyJWT, verifyAdmin, createCategory);

export default router;