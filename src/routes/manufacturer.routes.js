import express from "express";
import {
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,
  updateManufacturer,
  deleteManufacturer,
} from "../controllers/manufacturer.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createManufacturerValidator,
  updateManufacturerValidator,
} from "../validators/manufacturer.validator.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Create a new Manufacturer
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  createManufacturerValidator,
  createManufacturer
);

// Get all Manufacturers
router.get("/", authenticate, getAllManufacturers);

// Get a single Manufacturer by ID
router.get("/:id", authenticate, getManufacturerById);

// Update a Manufacturer by ID
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  updateManufacturerValidator,
  updateManufacturer
);

// Delete a Manufacturer by ID
router.delete("/:id", authenticate, authorize("admin"), deleteManufacturer);

export default router;
