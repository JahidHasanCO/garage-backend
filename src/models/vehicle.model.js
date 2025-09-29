import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
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
      example: 2025,
    },
    vin: {
      type: String,
      unique: true,
      sparse: true, // optional but unique if provided
      trim: true,
      uppercase: true,
      match: /^[A-HJ-NPR-Z0-9]{11,17}$/, // basic VIN validation
      example: "1HGCM82633A123456",
    },
    license_plate: {
      type: String,
      trim: true,
      uppercase: true,
      match: /^[A-Z0-9-]{3,10}$/, // basic license plate validation
      example: "DHA-1234",
    },
    color: {
      type: String,
      trim: true,
      default: "Unknown",
      example: "Black",
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    fuel_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FuelType",
      required: true,
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic", "cvt", "semi-automatic"],
      default: "manual",
    },
    image: {
      type: String, // URL of the vehicle image (Cloudinary or any storage)
      required: false,
      trim: true,
      example: "https://res.cloudinary.com/demo/vehicle.jpg",
    },
       description: {
      type: String,
      trim: true,
      example: "This is a well-maintained Corolla with low mileage.",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for searching vehicles by make + model + year
vehicleSchema.index({ make: 1, model: 1, year: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
