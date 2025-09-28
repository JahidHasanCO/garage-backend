import Booking from "../models/booking.model.js";
import Customer from "../models/customer.model.js";

// Get my bookings
export const getMyBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const customer = await Customer.findOne({ user_id: req.user.id });

        if (!customer) return res.status(404).json({ error: "Customer not found" });

        const [bookings, total] = await Promise.all([
            Booking.find({ customer_id: customer._id }).skip(skip).limit(limit),
            Booking.countDocuments({ customer_id: customer._id })
        ]);

        res.json({
            bookings,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { customer_id, vehicle_id, service_id, booking_date, notes } = req.body;
        const newBooking = new Booking({
            customer_id,
            vehicle_id,
            service_id,
            booking_date,
            notes
        });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // validate if the user is the owner of the booking or an admin
        if (booking.customer_id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // validate if the user is the owner of the booking or an admin
        if (booking.customer_id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        await booking.remove();
        res.json({ message: "Booking canceled" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update booking
export const updateBooking = async (req, res) => {
    try {
        const { vehicle_id, service_id, booking_date, status, notes } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        if (vehicle_id) booking.vehicle_id = vehicle_id;
        if (service_id) booking.service_id = service_id;
        if (booking_date) booking.booking_date = booking_date;
        if (status) booking.status = status;
        if (notes) booking.notes = notes;

        // validate if the user is the owner of the booking or an admin
        if (booking.customer_id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            Booking.find().skip(skip).limit(limit),
            Booking.countDocuments()
        ]);
        res.json({
            bookings,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
