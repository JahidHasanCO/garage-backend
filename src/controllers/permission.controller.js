import Permission from "../models/permission.model.js";

// Get all permissions
export const getAllPermissions = async (_req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get permission by ID
export const getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ error: "Permission not found" });
        res.json(permission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};  

// Create new permission
export const createPermission = async (req, res) => {
    try {
        const { title, value } = req.body;
        // 1. Check if permission already exists
        const existingPermission = await Permission.findOne({ value });
        if (existingPermission) {
            return res.status(400).json({ error: "Permission already exists" });
        }
        // 2. Create new permission
        const newPermission = new Permission({ title, value });
        await newPermission.save();
        res.status(201).json(newPermission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update permission by ID
export const updatePermission = async (req, res) => {
    try {
        const { title, value } = req.body;
        const permission = await Permission.findByIdAndUpdate(req.params.id, { title, value }, { new: true });
        if (!permission) return res.status(404).json({ error: "Permission not found" });
        res.json(permission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete permission by ID
export const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) return res.status(404).json({ error: "Permission not found" });
        res.json({ message: "Permission deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};