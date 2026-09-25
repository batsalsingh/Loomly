import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
     thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variants: [
      {
        size: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        stock: { type: Number, required: true, min: 0, default: 0 }
      }
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);