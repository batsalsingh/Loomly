import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCheckoutSession, handleStripeWebhook, sendStripeApiKey } from "../controllers/payment.controller.js";

const router = Router();

router.post("/webhook", handleStripeWebhook);
router.use(verifyJWT);

router.route("/process").post(createCheckoutSession);
router.route("/stripekey").get(sendStripeApiKey);

export default router;