import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of our custom ApiError, it might be an unhandled error.
  // We should convert it to an ApiError for a consistent response format.
  if (!(error instanceof ApiError)) {
    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ApiError(404, message);
    } 
    // Mongoose duplicate key
    else if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ApiError(400, message);
    }
    // Mongoose validation error
    else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ApiError(400, message);
    }
    // Default to 500 server error
    else {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }
  }

  // Now we have a consistent ApiError object, we can send the response.
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Show stack in dev mode
  };

  // Log the error for debugging purposes
  console.error(error);

  return res.status(error.statusCode).json(response);
};

export { errorHandler };