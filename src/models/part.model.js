import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows multiple documents with null/undefined sku
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create a sparse unique index on sku to allow multiple null values
partSchema.index({ sku: 1 }, { unique: true, sparse: true });

const Part = mongoose.model("Part", partSchema);
export default Part;
