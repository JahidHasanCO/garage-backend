import ServiceCatalog from "../models/service_catalog.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Get all services
export const getAllServices = async (_req, res) => {
  try {
    const services = await ServiceCatalog.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await ServiceCatalog.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, estimated_time, discount } = req.body;

    if (!name || !description || !price || !estimated_time) {
      return res.status(400).json({ error: "Name, description, price, and estimated_time are required" });
    }

    // Optional: check if service with same name exists
    const existingService = await ServiceCatalog.findOne({ name });
    if (existingService) {
      return res.status(400).json({ error: "Service already exists" });
    }

    // Upload image to Cloudinary if file is present
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "services");
    }

    const newService = new ServiceCatalog({
      name,
      description,
      price,
      estimated_time,
      discount: discount || 0,
      image: imageUrl,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update service by ID
export const updateService = async (req, res) => {
  try {
    const { name, description, price, estimated_time, discount } = req.body;

    // Prepare update data
    const updateData = {
      name,
      description,
      price,
      estimated_time,
      discount: discount || 0,
    };

    // If a new image file is uploaded, upload to Cloudinary
    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer, "services");
    } else if (req.body.image) {
      // Optional: allow updating with an image URL directly
      updateData.image = req.body.image;
    }

    const service = await ServiceCatalog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return the updated document
    );

    if (!service) return res.status(404).json({ error: "Service not found" });

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete service by ID
export const deleteService = async (req, res) => {
  try {
    const service = await ServiceCatalog.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
