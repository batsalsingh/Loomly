import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { ApiFeatures } from "../utils/ApiFeatures.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, trending, variants, features } = req.body;

  if ([name, description, price, stock, category].some((field) => !field)) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Parse variants if they are sent as a stringified JSON array
  let parsedVariants = [];
  if (variants) {
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      throw new ApiError(400, "Invalid variants format");
    }
  }

  let parsedFeatures = [];
  if (features) {
    try {
      parsedFeatures = typeof features === 'string'
        ? JSON.parse(features)
        : features;
    } catch (e) {
      parsedFeatures = features.split('\n').map(feature => feature.trim()).filter(Boolean);
    }
  }

  // req.files will be an array of files from multer
  const imageFiles = req.files;
  if (!imageFiles || imageFiles.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  // Upload all images to Cloudinary in parallel
  const imageUploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path));
  const cloudinaryResponses = await Promise.all(imageUploadPromises);

  // Check for any upload failures
  if (cloudinaryResponses.some(response => !response)) {
      throw new ApiError(500, "Failed to upload one or more product images");
  }

  const images = cloudinaryResponses.map(response => ({
    public_id: response.public_id,
    url: response.url,
  }));

  const product = await Product.create({
    name,
    description,
    features: parsedFeatures,
    price,
    stock,
    variants: parsedVariants,
    category,
    thumbnail: images[0], // Use the first image as the thumbnail
    images: images,       // Store all image objects in the images array
    trending: trending || false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId).populate("category", "name slug");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { styleSlug } = req.params;

  const category = await Category.findOne({ slug: styleSlug });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const products = await Product.find({ category: category._id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { category, products },
        "Products for category fetched successfully"
      )
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 12; // Number of products per page
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const products = await apiFeatures.query.populate("category", "name slug");
  
  const totalPages = Math.ceil(productCount / resultPerPage);

  return res.status(200).json(new ApiResponse(
    200, 
    {
      products,
      productCount,
      resultPerPage,
      totalPages
    }, 
    "All products fetched successfully"
  ));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, category, trending, variants, features } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Parse variants if they are sent as a stringified JSON array
    let parsedVariants;
    if (variants) {
      try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (e) {
        throw new ApiError(400, "Invalid variants format");
      }
    }

    let parsedFeatures;
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        parsedFeatures = features.split('\n').map(feature => feature.trim()).filter(Boolean);
      }
    }

    // Build update object dynamically to only update provided fields
    const updateData = { name, description, price, stock, category, trending };
    if (parsedVariants) {
        updateData.variants = parsedVariants;
    }
    if (parsedFeatures) {
      updateData.features = parsedFeatures;
    }

    // You can add more robust validation here, checking if fields are empty etc.
    const product = await Product.findByIdAndUpdate(
        productId,
        {
            $set: updateData
        },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }
    
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Optional: Delete product image from Cloudinary here
    // await cloudinary.uploader.destroy(product.productImage.public_id);
    
    await Product.findByIdAndDelete(productId);

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const getRelatedProducts = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
        throw new ApiError(404, "Product not found");
    }

    const relatedProducts = await Product.find({
        category: currentProduct.category, // Find products in the same category
        _id: { $ne: productId }           // Exclude the current product
    }).limit(4); // Limit to 4 related products

    return res
        .status(200)
        .json(new ApiResponse(200, relatedProducts, "Related products fetched successfully"));
});

// Make sure to export the new functions
export {
  createProduct, // (Modified)
  getProductById,
  getProductsByCategory,
  getAllProducts,
  updateProduct, 
  deleteProduct,
  getRelatedProducts, // (New)
};