export const createGarageValidator = (req, res, next) => {
  const { name, address, city, country, geo, contact, supportedManufacturers, supportedFuelTypes } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "Garage name is required and must be a non-empty string" });
  }

  if (!address || typeof address !== "string" || address.trim() === "") {
    return res.status(400).json({ message: "Garage address is required and must be a non-empty string" });
  }

  if (!city || typeof city !== "string" || city.trim() === "") {
    return res.status(400).json({ message: "Garage city is required and must be a non-empty string" });
  }

  if (country !== undefined && (typeof country !== "string" || country.trim() === "")) {
    return res.status(400).json({ message: "Garage country must be a non-empty string" });
  }

  if (geo) {
    if (typeof geo !== "object" || geo === null) {
      return res.status(400).json({ message: "Geo must be an object" });
    }
    if (geo.lat !== undefined && typeof geo.lat !== "number") {
      return res.status(400).json({ message: "Geo latitude must be a number" });
    }
    if (geo.lng !== undefined && typeof geo.lng !== "number") {
      return res.status(400).json({ message: "Geo longitude must be a number" });
    }
  }

  if (contact) {
    if (typeof contact !== "object" || contact === null) {
      return res.status(400).json({ message: "Contact must be an object" });
    }
    if (contact.phone !== undefined && typeof contact.phone !== "string") {
      return res.status(400).json({ message: "Contact phone must be a string" });
    }
    if (contact.email !== undefined && typeof contact.email !== "string") {
      return res.status(400).json({ message: "Contact email must be a string" });
    }
  }

  if (supportedManufacturers && !Array.isArray(supportedManufacturers)) {
    return res.status(400).json({ message: "Supported manufacturers must be an array" });
  }

  if (supportedFuelTypes && !Array.isArray(supportedFuelTypes)) {
    return res.status(400).json({ message: "Supported fuel types must be an array" });
  }

  next();
};

export const updateGarageValidator = (req, res, next) => {
  const { name, address, city, country, geo, contact, supportedManufacturers, supportedFuelTypes } = req.body;

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return res.status(400).json({ message: "Garage name must be a non-empty string" });
  }

  if (address !== undefined && (typeof address !== "string" || address.trim() === "")) {
    return res.status(400).json({ message: "Garage address must be a non-empty string" });
  }

  if (city !== undefined && (typeof city !== "string" || city.trim() === "")) {
    return res.status(400).json({ message: "Garage city must be a non-empty string" });
  }

  if (country !== undefined && (typeof country !== "string" || country.trim() === "")) {
    return res.status(400).json({ message: "Garage country must be a non-empty string" });
  }

  if (geo !== undefined) {
    if (typeof geo !== "object" || geo === null) {
      return res.status(400).json({ message: "Geo must be an object" });
    }
    if (geo.lat !== undefined && typeof geo.lat !== "number") {
      return res.status(400).json({ message: "Geo latitude must be a number" });
    }
    if (geo.lng !== undefined && typeof geo.lng !== "number") {
      return res.status(400).json({ message: "Geo longitude must be a number" });
    }
  }

  if (contact !== undefined) {
    if (typeof contact !== "object" || contact === null) {
      return res.status(400).json({ message: "Contact must be an object" });
    }
    if (contact.phone !== undefined && typeof contact.phone !== "string") {
      return res.status(400).json({ message: "Contact phone must be a string" });
    }
    if (contact.email !== undefined && typeof contact.email !== "string") {
      return res.status(400).json({ message: "Contact email must be a string" });
    }
  }

  if (supportedManufacturers !== undefined && !Array.isArray(supportedManufacturers)) {
    return res.status(400).json({ message: "Supported manufacturers must be an array" });
  }

  if (supportedFuelTypes !== undefined && !Array.isArray(supportedFuelTypes)) {
    return res.status(400).json({ message: "Supported fuel types must be an array" });
  }

  next();
};
