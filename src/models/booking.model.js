import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    servicePackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
    },
    singleService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCatalog",
    },

    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // could also be User with role=staff
    },

    status: {
      type: String,
      enum: [
        "requested",   // user requested
        "assigned",    // admin assigned staff
        "in_progress", // staff started
        "completed",   // staff marked done
        "paid",        // user paid
        "cancelled"
      ],
      default: "requested",
    },

    // Payment info
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      method: { type: String }, // cash, card, bkash, etc
      transactionId: { type: String },
      amount: { type: Number, required: true },
    },

    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
