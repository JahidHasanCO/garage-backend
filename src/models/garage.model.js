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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
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

garageSchema.index({ location: "2dsphere" });

// Middleware to sync geo.lat/lng → location.coordinates
garageSchema.pre("save", function (next) {
  if (this.geo.lat && this.geo.lng) {
    this.location = {
      type: "Point",
      coordinates: [this.geo.lng, this.geo.lat],
    };
  }
  next();
});

const Garage = mongoose.model("Garage", garageSchema);
export default Garage;
