import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customer_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true},
    vehicle_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true},
    service_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true},
    booking_date : {type: Date, required: true},
    status : {type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending'},
    notes : {type: String},
}, { timestamps: true }); 

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;