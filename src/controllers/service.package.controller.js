import ServicePackage from "../models/service.package.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Get all service packages with pagination, populate related fields
export const getAllServicePackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      ServicePackage.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "services",
          populate: { path: "parts_needed" }
        })
        .populate("applicableFuelTypes")
        .populate("applicableManufacturers")
        .populate("garages"),
      ServicePackage.countDocuments()
    ]);

    res.json({
      packages,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single package by ID
export const getServicePackageById = async (req, res) => {
  try {
    const pkg = await ServicePackage.findById(req.params.id)
      .populate({
        path: "services",
        populate: { path: "parts_needed" }
      })
      .populate("applicableFuelTypes")
      .populate("applicableManufacturers")
      .populate("garages");

    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new service package
export const createServicePackage = async (req, res) => {
  try {
    const { name, description, price, duration, services, applicableFuelTypes, applicableManufacturers, garages } = req.body;

    if (!name || !price || !services || !garages) {
      return res.status(400).json({ error: "Name, price, services, and garages are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "service_packages");
    }

    const newPackage = new ServicePackage({
      name,
      description: description || "",
      price,
      duration: duration || 0,
      services,
      applicableFuelTypes: applicableFuelTypes || [],
      applicableManufacturers: applicableManufacturers || [],
      garages,
      image: imageUrl || "",
    });

    await newPackage.save();
    await newPackage.populate({
      path: "services",
      populate: { path: "parts_needed" }
    }).populate("applicableFuelTypes applicableManufacturers garages");

    res.status(201).json(newPackage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update service package
export const updateServicePackage = async (req, res) => {
  try {
    const { name, description, price, duration, services, applicableFuelTypes, applicableManufacturers, garages } = req.body;

    const updateData = {
      name,
      description,
      price,
      duration: duration || 0,
      services,
      applicableFuelTypes: applicableFuelTypes || [],
      applicableManufacturers: applicableManufacturers || [],
      garages,
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer, "service_packages");
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const pkg = await ServicePackage.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate({
        path: "services",
        populate: { path: "parts_needed" }
      })
      .populate("applicableFuelTypes applicableManufacturers garages");

    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete service package
export const deleteServicePackage = async (req, res) => {
  try {
    const pkg = await ServicePackage.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
