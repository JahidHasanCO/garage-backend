import express from "express";
import multer from "multer";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createVehicleValidator,
  updateVehicleValidator,
} from "../validators/vehicle.validator.js";

const router = express.Router();

// Multer setup for file uploads (vehicle images)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new Vehicle
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"), // accepts single image upload
  createVehicleValidator,
  createVehicle
);

// Get all Vehicles
router.get("/", authenticate, getAllVehicles);

// Get a single Vehicle by ID
router.get("/:id", authenticate, getVehicleById);

// Update a Vehicle by ID
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  updateVehicleValidator,
  updateVehicle
);

// Delete a Vehicle by ID
router.delete("/:id", authenticate, authorize("admin"), deleteVehicle);

export default router;
