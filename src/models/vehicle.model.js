import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
      example: "Toyota",
    },
    model: {
      type: String,
      required: true,
      trim: true,
      example: "Corolla",
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1, // allow next year's models
      example: 2022,
    },
    vin: {
      type: String,
      unique: true,
      sparse: true, // optional but unique if provided
      trim: true,
      uppercase: true,
      example: "1HGCM82633A123456",
    },
    license_plate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      example: "DHA-1234",
    },
    color: {
      type: String,
      trim: true,
      example: "Black",
    },
    mileage: {
      type: Number,
      default: 0,
    },
    fuel_type: {
      type: String,
      enum: ["petrol", "diesel", "cng", "electric", "hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic", "cvt", "semi-automatic"],
    },
    last_service_date: {
      type: Date,
    },
    next_service_due: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
