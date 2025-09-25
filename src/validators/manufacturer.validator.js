export const createManufacturerValidator = (req, res, next) => {
  const { name, country } = req.body || {};

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Manufacturer name is required" });
  }

  if (!country || country.trim() === "") {
    return res.status(400).json({ message: "Country is required" });
  }

  next();
};

// For updating a manufacturer (all optional, at least one field)
export const updateManufacturerValidator = (req, res, next) => {
  const { name, country } = req.body || {};

  if (!name && !country && !req.file) {
    return res.status(400).json({
      message: "At least one field (name, country, or logo) must be provided",
    });
  }

  next();
};
