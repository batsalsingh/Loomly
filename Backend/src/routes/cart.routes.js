import { Router } from "express";
import {
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All cart routes require a user to be logged in
router.use(verifyJWT);

router.route("/").get(getUserCart).post(addItemToCart);
router.route("/item").patch(updateCartItemQuantity);
router.route("/item/:productId").delete(removeItemFromCart);

export default router;