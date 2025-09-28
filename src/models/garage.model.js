import mongoose from "mongoose";

const garageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "Bangladesh" },
    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    supportedManufacturers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
      },
    ],
    supportedFuelTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FuelType",
      },
    ],
  },
  { timestamps: true }
);

const Garage = mongoose.model("Garage", garageSchema);
export default Garage;
