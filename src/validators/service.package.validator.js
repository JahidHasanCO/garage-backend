export const createServicePackageValidator = (req, res, next) => {
  const { name, price, services } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Package name is required" });
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ message: "At least one service is required in the package" });
  }

  next();
};

export const updateServicePackageValidator = (req, res, next) => {
  const { name, price, services } = req.body;

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ message: "Package name cannot be empty" });
  }

  if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (services !== undefined && (!Array.isArray(services) || services.length === 0)) {
    return res.status(400).json({ message: "At least one service is required in the package" });
  }

  next();
};
