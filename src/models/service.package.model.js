import mongoose from "mongoose";

const servicePackageSchema = new mongoose.Schema(
  {
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
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCatalog",
        required: true,
      }
    ],
    applicableFuelTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FuelType",
      }
    ],
    applicableManufacturers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
      }
    ],
    garages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true,
      },
    ],
    image: {
      type: String, // URL of package image
      default: "",
    },
  },
  { timestamps: true }
);

servicePackageSchema.index({ garages: 1 });
servicePackageSchema.index({ applicableFuelTypes: 1 });
servicePackageSchema.index({ applicableManufacturers: 1 });

const ServicePackage = mongoose.model("ServicePackage", servicePackageSchema);
export default ServicePackage;
