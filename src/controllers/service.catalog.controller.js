import ServiceCatalog from "../models/service.catalog.model.js";
import Part from "../models/part.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Get all services with pagination, populate parts
export const getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      ServiceCatalog.find()
        .populate("parts_needed") // populate parts
        .skip(skip)
        .limit(limit),
      ServiceCatalog.countDocuments()
    ]);

    res.json({
      services,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get service by ID, populate parts
export const getServiceById = async (req, res) => {
  try {
    const service = await ServiceCatalog.findById(req.params.id).populate("parts_needed");
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create service
export const createService = async (req, res) => {
  try {
    const { name, description, price, estimated_time, discount, parts_needed } = req.body;

    if (!name || !price || !estimated_time) {
      return res.status(400).json({ error: "Name, price, and estimated_time are required" });
    }

    const existingService = await ServiceCatalog.findOne({ name });
    if (existingService) {
      return res.status(400).json({ error: "Service already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "services");
    }

    // Validate parts if provided
    let partsArray = [];
    if (parts_needed && Array.isArray(parts_needed)) {
      partsArray = await Part.find({ _id: { $in: parts_needed } });
    }

    const newService = new ServiceCatalog({
      name,
      description: description || "",
      price,
      estimated_time,
      discount: discount || 0,
      parts_needed: partsArray.map(p => p._id),
      image: imageUrl,
    });

    await newService.save();
    await newService.populate("parts_needed");

    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { name, description, price, estimated_time, discount, parts_needed } = req.body;

    const updateData = {
      name,
      description,
      price,
      estimated_time,
      discount: discount || 0,
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer, "services");
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    // Validate parts if provided
    if (parts_needed && Array.isArray(parts_needed)) {
      const partsArray = await Part.find({ _id: { $in: parts_needed } });
      updateData.parts_needed = partsArray.map(p => p._id);
    }

    const service = await ServiceCatalog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("parts_needed");

    if (!service) return res.status(404).json({ error: "Service not found" });

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete service
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
