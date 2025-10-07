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
            Booking.find({ user: customer._id }).skip(skip).limit(limit).populate('garage').populate('assignedStaff').populate('servicePackage').populate('singleService'),
            Booking.countDocuments({ user: customer._id })
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
        // Accept either servicePackage or singleService. If request is from a customer, associate their customer record.
        const { customer_id, servicePackage, singleService, garage, assignedStaff, payment, requestedAt, notes } = req.body;

        let userRef = customer_id;
        if (!userRef && req.user && req.user.role === 'customer') {
            const customer = await Customer.findOne({ user_id: req.user.id });
            if (!customer) return res.status(404).json({ error: 'Customer not found' });
            userRef = customer._id;
        }

        const newBooking = new Booking({
            user: userRef,
            servicePackage: servicePackage || null,
            singleService: singleService || null,
            garage,
            assignedStaff: assignedStaff || null,
            payment: payment || {},
            requestedAt: requestedAt || Date.now(),
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
        const booking = await Booking.findById(req.params.id).populate('garage').populate('assignedStaff').populate('servicePackage').populate('singleService');
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // validate if the user is the owner of the booking or an admin
        // booking.user references Customer._id, need to map to req.user.id via Customer
        if (req.user.role !== 'admin') {
            const customer = await Customer.findOne({ user_id: req.user.id });
            if (!customer || booking.user.toString() !== customer._id.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
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
        if (req.user.role !== 'admin') {
            const customer = await Customer.findOne({ user_id: req.user.id });
            if (!customer || booking.user.toString() !== customer._id.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }

        await booking.remove();
        res.json({ message: 'Booking canceled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update booking
export const updateBooking = async (req, res) => {
    try {
        const { servicePackage, singleService, garage, assignedStaff, status, payment, requestedAt, completedAt, notes } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        if (servicePackage !== undefined) booking.servicePackage = servicePackage;
        if (singleService !== undefined) booking.singleService = singleService;
        if (garage !== undefined) booking.garage = garage;
        if (assignedStaff !== undefined) booking.assignedStaff = assignedStaff;
        if (status !== undefined) booking.status = status;
        if (payment !== undefined) booking.payment = payment;
        if (requestedAt !== undefined) booking.requestedAt = requestedAt;
        if (completedAt !== undefined) booking.completedAt = completedAt;
        if (notes !== undefined) booking.notes = notes;

        // validate if the user is the owner of the booking or an admin
        if (req.user.role !== 'admin') {
            const customer = await Customer.findOne({ user_id: req.user.id });
            if (!customer || booking.user.toString() !== customer._id.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }

        await booking.save();
        const populated = await Booking.findById(booking._id).populate('garage').populate('assignedStaff').populate('servicePackage').populate('singleService');
        res.json(populated);
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
