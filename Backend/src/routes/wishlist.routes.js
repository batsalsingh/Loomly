import { Router } from "express";
import {
  getUserWishlist,
  addOrRemoveFromWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All wishlist routes require a user to be logged in
router.use(verifyJWT);

router.route("/").get(getUserWishlist);
router.route("/toggle").post(addOrRemoveFromWishlist);

export default router;