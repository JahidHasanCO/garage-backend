import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "../models/staff.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

// List staff with pagination and optional filters
export const getAllStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.garage && mongoose.Types.ObjectId.isValid(req.query.garage)) {
      filter.garage = req.query.garage;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.role) filter.role = req.query.role;

    const [staff, total] = await Promise.all([
      Staff.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("user_id", "name email")
        .populate("garage", "name"),
      Staff.countDocuments(filter),
    ]);

    res.json({ staff, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get staff by id
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("garage", "name");

    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create staff
export const createStaff = async (req, res) => {
  try {
    // Expect user info to be provided to create an associated User
  const { name, email, password, user_id, garage, role, status, isActive } = req.body;

    let linkedUserId = user_id;

    // If user_id not provided, create a new User for this staff
    let createdUser = null;
    if (!linkedUserId) {
      if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email and password are required to create a new user" });
      }

      // Check existing user
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Find staff role
      const staffRole = await Role.findOne({ value: "staff" });
      const roleId = staffRole ? staffRole._id : null;

      createdUser = await User.create({
        name,
        email,
        password: hashed,
        role_id: roleId,
      });

      linkedUserId = createdUser._id;
    }

    const newStaff = new Staff({
      user_id: linkedUserId,
      garage,
      role,
      status,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newStaff.save();
  const populated = await Staff.findById(newStaff._id).populate("user_id", "name email").populate("garage", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    // If we created a user but staff save failed, try to rollback the user
    try {
      if (err && err.name && err.name === 'ValidationError' && err._message && err._message.includes('Staff')) {
        // do nothing special
      }
    } catch (e) {}

    // If createdUser exists and failure occurred, remove it
    try {
      if (typeof createdUser !== 'undefined' && createdUser && createdUser._id) {
        await User.findByIdAndDelete(createdUser._id);
      }
    } catch (cleanupErr) {
      console.error('Failed to cleanup user after staff creation failure:', cleanupErr);
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
  const updateData = {};
  const { user_id, garage, role, status, isActive } = req.body;
    if (user_id !== undefined) updateData.user_id = user_id;
    if (garage !== undefined) updateData.garage = garage;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (isActive !== undefined) updateData.isActive = isActive;

    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
  .populate("user_id", "name email")
  .populate("garage", "name");

    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    // Find staff first so we have access to linked user_id
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    const linkedUserId = staff.user_id;

    // Delete staff record
    await Staff.findByIdAndDelete(req.params.id);

    // Best-effort: delete associated User as well (if exists)
    try {
      if (linkedUserId) {
        await User.findByIdAndDelete(linkedUserId);
      }
    } catch (userDelErr) {
      console.error('Failed to delete linked user after staff deletion:', userDelErr);
      // proceed — staff is already deleted
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
