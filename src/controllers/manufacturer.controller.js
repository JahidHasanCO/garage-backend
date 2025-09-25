import Manufacturer from "../models/manufacturer.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Create a new Manufacturer
export const createManufacturer = async (req, res) => {
  try {
    const { name, country, founded, website } = req.body;

    // check if manufacturer already exists
    const existing = await Manufacturer.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Manufacturer already exists" });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer, "manufacturers");
    }

    const manufacturer = new Manufacturer({
      name,
      country,
      founded,
      website,
      logo: logoUrl,
    });

    await manufacturer.save();
    res.status(201).json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Manufacturers
export const getAllManufacturers = async (_req, res) => {
  try {
    const manufacturers = await Manufacturer.find().sort({ createdAt: -1 });
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Manufacturer by ID
export const getManufacturerById = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }
    res.status(200).json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Manufacturer
export const updateManufacturer = async (req, res) => {
  try {
    const { name, country, founded, website } = req.body;

    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    // handle logo upload
    if (req.file) {
      manufacturer.logo = await uploadToCloudinary(
        req.file.buffer,
        "manufacturers"
      );
    } else if (req.body.logo) {
      manufacturer.logo = req.body.logo;
    }

    if (name) manufacturer.name = name.trim();
    if (country) manufacturer.country = country;
    if (founded) manufacturer.founded = founded;
    if (website) manufacturer.website = website;

    await manufacturer.save();
    res.status(200).json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Manufacturer by ID
export const deleteManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }
    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
