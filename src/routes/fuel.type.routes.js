import express from "express";
import {
  createFuelType,
  getAllFuelTypes,
  getFuelTypeById,
  updateFuelType,
  deleteFuelType,
} from "../controllers/fuel.type.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { fuelTypeValidator } from "../validators/fuel.type.validator.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

// Create a new FuelType
router.post("/", authenticate, authorize("admin"), upload.single("image"), fuelTypeValidator, createFuelType);

// Get all FuelTypes
router.get("/", authenticate, getAllFuelTypes);

// Get a single FuelType by ID
router.get("/:id", authenticate, getFuelTypeById);

// Update a FuelType by ID
router.put("/:id", authenticate, authorize("admin"), upload.single("image"), fuelTypeValidator, updateFuelType);

// Delete a FuelType by ID
router.delete("/:id", authenticate, authorize("admin"), deleteFuelType);

export default router;
