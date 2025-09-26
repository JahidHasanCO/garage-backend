export const partValidator = (req, res, next) => {
  const { name, price, sku } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required" });
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (sku && sku.trim() === "") {
    return res.status(400).json({ message: "SKU cannot be empty if provided" });
  }

  next();
};
