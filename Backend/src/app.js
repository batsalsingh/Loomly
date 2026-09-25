// backend/src/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// --- CORE MIDDLEWARE ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Use the .env variable
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Apply rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter); // Apply limiter only to API routes

// --- ROUTES IMPORT ---
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// --- ROUTES DECLARATION ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/", (req, res) => {
    res.send(`<h1>Loomly API is Working!!!</h1>`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// The error handler MUST be the last middleware
app.use(errorHandler);

export { app };