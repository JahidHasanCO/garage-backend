
export const fuelTypeValidator = (req, res, next) => {
  const title = req.body.title;
  const value = req.body.value;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!value || value.trim() === "") {
    return res.status(400).json({ message: "Value is required" });
  }

  next();
};
