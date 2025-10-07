export const createStaffValidator = (req, res, next) => {
  const { user_id, garage, role, skills, status, isActive, name, email, password } = req.body;

  // Require either existing user_id or user creation fields
  if (!user_id) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'name is required to create a user' });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: 'email is required to create a user' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'password is required and must be at least 6 characters' });
    }
  }

  if (!garage) return res.status(400).json({ message: "garage is required" });

  if (role !== undefined && !["mechanic", "technician", "cleaner", "manager", "support"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (status !== undefined && !["available", "busy", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // skills removed

  next();
};

export const updateStaffValidator = (req, res, next) => {
  const { role, status, isActive } = req.body;

  if (role !== undefined && !["mechanic", "technician", "cleaner", "manager", "support"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (status !== undefined && !["available", "busy", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // skills removed

  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be boolean" });
  }

  next();
};
