export const createPartValidator = (req, res, next) => {
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

export const updatePartValidator = (req, res, next) => {
  const { name, price, sku } = req.body;

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (price !== undefined) {
    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }
  }

  if (sku !== undefined && sku.trim() === "") {
    return res.status(400).json({ message: "SKU cannot be empty if provided" });
  }

  next();
};
