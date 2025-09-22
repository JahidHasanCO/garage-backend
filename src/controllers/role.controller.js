import Role from "../models/role.model.js";

// Get all rolls
export const getAllRoles = async (_req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get roll by ID
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ error: "Role not found" });
        res.json(role);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};  

// Create new role
export const createRole = async (req, res) => {
    try {
        const { title, value } = req.body;
        // 1. Check if role already exists
        const existingRole = await Role.findOne({ value });
        if (existingRole) {
            return res.status(400).json({ error: "Role already exists" });
        }       
        // 2. Create new roll
        const newRole = new Role({ title, value });
        await newRole.save();
        res.status(201).json(newRole);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update role by ID
export const updateRole = async (req, res) => {
    try {
        const { title, value } = req.body;
        const role = await Role.findByIdAndUpdate(req.params.id, { title, value }, { new: true });
        if (!role) return res.status(404).json({ error: "Role not found" });
        res.json(role);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete role by ID
export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ error: "Role not found" });
        res.json({ message: "Role deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};