import ServiceCatalog from "../models/service_catalog.model.js";

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

// Create new service
export const createService = async (req, res) => {
  try {
    const { name, description, price, estimated_time, image, discount } = req.body;

    // Optional: check if service with same name exists
    const existingService = await ServiceCatalog.findOne({ name });
    if (existingService) {
      return res.status(400).json({ error: "Service already exists" });
    }

    const newService = new ServiceCatalog({
      name,
      description,
      price,
      estimated_time,
      image,
      discount,
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
    const { name, description, price, estimated_time, image, discount } = req.body;

    const service = await ServiceCatalog.findByIdAndUpdate(
      req.params.id,
      { name, description, price, estimated_time, image, discount },
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
