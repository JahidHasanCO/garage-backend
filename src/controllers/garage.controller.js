import Garage from "../models/garage.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Get all garages with pagination
export const getAllGarages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [garages, total] = await Promise.all([
      Garage.find()
        .skip(skip)
        .limit(limit),
      Garage.countDocuments()
    ]);

    res.json({
      garages,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get garage by ID
export const getGarageById = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) return res.status(404).json({ error: "Garage not found" });
    res.json(garage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new garage
export const createGarage = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "garages");
    }

    const newGarage = new Garage({
      name,
      location,
      description: description || "",
      image: imageUrl,
    });

    await newGarage.save();
    res.status(201).json(newGarage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update garage
export const updateGarage = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    const updateData = {
      name,
      location,
      description,
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer, "garages");
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const garage = await Garage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!garage) return res.status(404).json({ error: "Garage not found" });
    res.json(garage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete garage
export const deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findByIdAndDelete(req.params.id);
    if (!garage) return res.status(404).json({ error: "Garage not found" });
    res.json({ message: "Garage deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
