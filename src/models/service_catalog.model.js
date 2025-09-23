import mongoose from "mongoose";

const serviceCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  estimated_time: {
    type: Number, 
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

const ServiceCatalog = mongoose.model("ServiceCatalog", serviceCatalogSchema);

export default ServiceCatalog;
