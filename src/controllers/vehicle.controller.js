import Vehicle from "../models/vehicle.model.js";
import { uploadToCloudinary } from "../utils/helpers/cloudinary_upload.js";

// Create a new Vehicle
export const createVehicle = async (req, res) => {
  try {
    const {
      manufacturer,
      model,
      year,
      vin,
      license_plate,
      color,
      mileage,
      fuel_type,
      transmission,
      description,
    } = req.body;

    // Check unique VIN
    if (vin) {
      const existingVin = await Vehicle.findOne({ vin: vin.toUpperCase() });
      if (existingVin) {
        return res.status(400).json({ message: "VIN already exists" });
      }
    }

    // Check unique license plate
    const existingPlate = await Vehicle.findOne({ license_plate: license_plate.toUpperCase() });
    if (existingPlate) {
      return res.status(400).json({ message: "License plate already exists" });
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "vehicles");
    }

    const vehicle = new Vehicle({
      manufacturer,
      model,
      year,
      vin: vin ? vin.toUpperCase() : undefined,
      license_plate: license_plate.toUpperCase(),
      color,
      mileage,
      fuel_type,
      transmission,
      image: imageUrl,
      description,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Vehicles
export const getAllVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("manufacturer", "name country")
      .populate("fuel_type", "title value")
      .sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("manufacturer", "name country")
      .populate("fuel_type", "title value");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const {
      manufacturer,
      model,
      year,
      vin,
      license_plate,
      color,
      mileage,
      fuel_type,
      transmission,
      description,
    } = req.body;

    // Update VIN if provided and unique
    if (vin && vin.toUpperCase() !== vehicle.vin) {
      const existingVin = await Vehicle.findOne({ vin: vin.toUpperCase() });
      if (existingVin) return res.status(400).json({ message: "VIN already exists" });
      vehicle.vin = vin.toUpperCase();
    }

    // Update license plate if provided and unique
    if (license_plate && license_plate.toUpperCase() !== vehicle.license_plate) {
      const existingPlate = await Vehicle.findOne({ license_plate: license_plate.toUpperCase() });
      if (existingPlate) return res.status(400).json({ message: "License plate already exists" });
      vehicle.license_plate = license_plate.toUpperCase();
    }

    // Update image if file uploaded
    if (req.file) {
      vehicle.image = await uploadToCloudinary(req.file.buffer, "vehicles");
    }

    // Update other fields
    if (manufacturer) vehicle.manufacturer = manufacturer;
    if (model) vehicle.model = model;
    if (year) vehicle.year = year;
    if (color) vehicle.color = color;
    if (mileage !== undefined) vehicle.mileage = mileage;
    if (fuel_type) vehicle.fuel_type = fuel_type;
    if (transmission) vehicle.transmission = transmission;
    if (description !== undefined) vehicle.description = description;

    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Vehicle by ID
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
