import FuelType from "../models/fuel.type.models.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Create a new FuelType
export const createFuelType = async (req, res) => {
  try {
    const { title, value } = req.body;

    const existing = await FuelType.findOne({ value: value.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Fuel type already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "fuel_types");
    }

    const fuelType = new FuelType({ title, value, image: imageUrl });
    await fuelType.save();

    res.status(201).json(fuelType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all FuelTypes
export const getAllFuelTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [fuelTypes, total] = await Promise.all([
      FuelType.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      FuelType.countDocuments()
    ]);

    res.status(200).json({
      data: fuelTypes,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single FuelType by ID
export const getFuelTypeById = async (req, res) => {
  try {
    const fuelType = await FuelType.findById(req.params.id);
    if (!fuelType) {
      return res.status(404).json({ message: "Fuel type not found" });
    }
    res.status(200).json(fuelType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFuelType = async (req, res) => {
  try {
    const { title, value } = req.body;

    const fuelType = await FuelType.findById(req.params.id);
    if (!fuelType) {
      return res.status(404).json({ message: "Fuel type not found" });
    }

    // Handle image upload
    if (req.file) {
      fuelType.image = await uploadToCloudinary(req.file.buffer, "fuel_types");
    } else if (req.body.image) {
      fuelType.image = req.body.image;
    }

    // Update other fields
    if (title) fuelType.title = title;
    if (value) fuelType.value = value.toLowerCase();

    await fuelType.save();
    res.status(200).json(fuelType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete FuelType by ID
export const deleteFuelType = async (req, res) => {
  try {
    const fuelType = await FuelType.findByIdAndDelete(req.params.id);
    if (!fuelType) {
      return res.status(404).json({ message: "Fuel type not found" });
    }
    res.status(200).json({ message: "Fuel type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
