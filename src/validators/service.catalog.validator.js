export const serviceCatalogValidator = (req, res, next) => {
  const { name, price, estimated_time, parts_needed } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Service name is required" });
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (estimated_time === undefined || isNaN(estimated_time) || Number(estimated_time) < 0) {
    return res.status(400).json({ message: "Valid estimated_time is required" });
  }

  if (parts_needed && !Array.isArray(parts_needed)) {
    return res.status(400).json({ message: "parts_needed must be an array of part IDs" });
  }

  next();
};
