import mongoose from "mongoose";

const fuelTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const FuelType = mongoose.model("FuelType", fuelTypeSchema);

export default FuelType;
