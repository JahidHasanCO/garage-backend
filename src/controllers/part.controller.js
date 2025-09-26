import Part from "../models/part.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Create a new Part
export const createPart = async (req, res) => {
  try {
    const { name, sku, description, price } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existing = await Part.findOne({ sku });
      if (existing) {
        return res.status(400).json({ message: "Part with this SKU already exists" });
      }
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "parts");
    }

    const part = new Part({
      name,
      sku,
      description,
      price,
      image: imageUrl,
    });

    await part.save();
    res.status(201).json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Parts
export const getAllParts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [parts, total] = await Promise.all([
      Part.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Part.countDocuments()
    ]);

    res.status(200).json({
      parts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Part by ID
export const getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Part by ID
export const updatePart = async (req, res) => {
  try {
    const { name, sku, description, price } = req.body;

    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }

    // Handle image upload
    if (req.file) {
      part.image = await uploadToCloudinary(req.file.buffer, "parts");
    } else if (req.body.image) {
      part.image = req.body.image;
    }

    // Update other fields
    if (name) part.name = name;
    if (sku) part.sku = sku;
    if (description) part.description = description;
    if (price !== undefined) part.price = price;

    await part.save();
    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Part by ID
export const deletePart = async (req, res) => {
  try {
    const part = await Part.findByIdAndDelete(req.params.id);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    res.status(200).json({ message: "Part deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
