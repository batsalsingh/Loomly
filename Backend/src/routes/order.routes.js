import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// All routes are protected
router.use(verifyJWT);

// User routes
router.route("/create").post(createOrder);
router.route("/my-orders").get(getMyOrders);
router.route("/:orderId").get(getOrderById);

// Admin routes
router.route("/admin/all").get(verifyAdmin, getAllOrders);
router.route("/admin/status/:orderId").patch(verifyAdmin, updateOrderStatus);

export default router;