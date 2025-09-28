export const createGarageValidator = (req, res, next) => {
  const { name, location } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Garage name is required" });
  }

  if (!location || location.trim() === "") {
    return res.status(400).json({ message: "Garage location is required" });
  }

  next();
};

export const updateGarageValidator = (req, res, next) => {
  const { name, location } = req.body;

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ message: "Garage name cannot be empty" });
  }

  if (location !== undefined && location.trim() === "") {
    return res.status(400).json({ message: "Garage location cannot be empty" });
  }

  next();
};
