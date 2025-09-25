
export const createVehicleValidator = (req, res, next) => {
  const {
    manufacturer,
    model,
    year,
    license_plate,
    fuel_type,
    transmission,
  } = req.body;

  if (!manufacturer || manufacturer.trim() === "") {
    return res.status(400).json({ message: "Manufacturer is required" });
  }

  if (!model || model.trim() === "") {
    return res.status(400).json({ message: "Model is required" });
  }

  if (!year || isNaN(Number(year))) {
    return res.status(400).json({ message: "Valid year is required" });
  }

  if (!license_plate || license_plate.trim() === "") {
    return res.status(400).json({ message: "License plate is required" });
  }

  if (!fuel_type || fuel_type.trim() === "") {
    return res.status(400).json({ message: "Fuel type is required" });
  }

  next();
};

// Validator for updating a vehicle (all fields optional, but at least one must be provided)
export const updateVehicleValidator = (req, res, next) => {
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

  if (
    !manufacturer &&
    !model &&
    !year &&
    !vin &&
    !license_plate &&
    !color &&
    mileage === undefined &&
    !fuel_type &&
    !transmission &&
    !description &&
    !req.file
  ) {
    return res.status(400).json({
      message: "At least one field (or an image) must be provided for update",
    });
  }

  next();
};
