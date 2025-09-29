export const createServicePackageValidator = (req, res, next) => {
  let { name, price, services, garages, applicableManufacturers, applicableFuelTypes } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Package name is required" });
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  // Parse JSON strings if they come from form data
  if (typeof services === "string") {
    try {
      services = JSON.parse(services);
      req.body.services = services; // Update req.body
    } catch (e) {
      return res.status(400).json({ message: "Services must be a valid JSON array" });
    }
  }

  if (typeof garages === "string") {
    try {
      garages = JSON.parse(garages);
      req.body.garages = garages;
    } catch (e) {
      return res.status(400).json({ message: "Garages must be a valid JSON array" });
    }
  }

  if (typeof applicableManufacturers === "string") {
    try {
      applicableManufacturers = JSON.parse(applicableManufacturers);
      req.body.applicableManufacturers = applicableManufacturers;
    } catch (e) {
      return res.status(400).json({ message: "Applicable manufacturers must be a valid JSON array" });
    }
  }

  if (typeof applicableFuelTypes === "string") {
    try {
      applicableFuelTypes = JSON.parse(applicableFuelTypes);
      req.body.applicableFuelTypes = applicableFuelTypes;
    } catch (e) {
      return res.status(400).json({ message: "Applicable fuel types must be a valid JSON array" });
    }
  }

  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ message: "At least one service is required in the package" });
  }

  if (!garages || !Array.isArray(garages) || garages.length === 0) {
    return res.status(400).json({ message: "At least one garage is required" });
  }

  next();
};

export const updateServicePackageValidator = (req, res, next) => {
  let { name, price, services, garages, applicableManufacturers, applicableFuelTypes } = req.body;

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ message: "Package name cannot be empty" });
  }

  if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  // Parse JSON strings if they come from form data
  if (typeof services === "string") {
    try {
      services = JSON.parse(services);
      req.body.services = services; // Update req.body
    } catch (e) {
      return res.status(400).json({ message: "Services must be a valid JSON array" });
    }
  }

  if (typeof garages === "string") {
    try {
      garages = JSON.parse(garages);
      req.body.garages = garages;
    } catch (e) {
      return res.status(400).json({ message: "Garages must be a valid JSON array" });
    }
  }

  if (typeof applicableManufacturers === "string") {
    try {
      applicableManufacturers = JSON.parse(applicableManufacturers);
      req.body.applicableManufacturers = applicableManufacturers;
    } catch (e) {
      return res.status(400).json({ message: "Applicable manufacturers must be a valid JSON array" });
    }
  }

  if (typeof applicableFuelTypes === "string") {
    try {
      applicableFuelTypes = JSON.parse(applicableFuelTypes);
      req.body.applicableFuelTypes = applicableFuelTypes;
    } catch (e) {
      return res.status(400).json({ message: "Applicable fuel types must be a valid JSON array" });
    }
  }

  if (services !== undefined && (!Array.isArray(services) || services.length === 0)) {
    return res.status(400).json({ message: "At least one service is required in the package" });
  }

  if (garages !== undefined && (!Array.isArray(garages) || garages.length === 0)) {
    return res.status(400).json({ message: "At least one garage is required" });
  }

  next();
};
