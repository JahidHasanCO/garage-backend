import Vehicle from "../models/vehicle.model.js";

// Get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [vehicles, total] = await Promise.all([
            Vehicle.find()
                .populate("customer_id", "address user_id")
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments()
        ]);

        res.json({
            vehicles,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("customer_id", "address user_id");
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Create new vehicle
export const createVehicle = async (req, res) => {
    try {
        const {
            customer_id,
            make,
            model,
            year,
            vin,
            license_plate,
            color,
            mileage,
            fuel_type,
            transmission,
            last_service_date,
            next_service_due,
            notes,
        } = req.body;

        // Check if VIN already exists
        if (vin) {
            const existingVehicle = await Vehicle.findOne({ vin });
            if (existingVehicle) {
                return res.status(400).json({ error: "Vehicle with this VIN already exists" });
            }
        }

        const newVehicle = new Vehicle({
            customer_id,
            make,
            model,
            year,
            vin,
            license_plate,
            color,
            mileage,
            fuel_type,
            transmission,
            last_service_date,
            next_service_due,
            notes,
        });

        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update vehicle by ID
export const updateVehicle = async (req, res) => {
    try {
        const updates = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete vehicle by ID
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
        res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
