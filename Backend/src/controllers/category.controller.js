import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    throw new ApiError(400, "Category name and slug are required");
  }

  const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });

  if (existingCategory) {
    throw new ApiError(409, "Category with this name or slug already exists");
  }

  const category = await Category.create({
    name,
    slug,
  });

  if (!category) {
    throw new ApiError(500, "Failed to create the category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  if (!categories) {
    throw new ApiError(404, "No categories found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "Categories fetched successfully")
    );
});

export { createCategory, getAllCategories };