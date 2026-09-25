import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden: You are not authorized to perform this action.");
  }
  next();
});