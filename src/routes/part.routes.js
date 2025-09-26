import express from "express";
import {
  createPart,
  getAllParts,
  getPartById,
  updatePart,
  deletePart,
} from "../controllers/part.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { partValidator } from "../validators/part.validator.js"; 
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Create a new Part
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  partValidator,
  createPart
);

// Get all Parts
router.get("/", authenticate, getAllParts);

// Get a single Part by ID
router.get("/:id", authenticate, getPartById);

// Update a Part by ID
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  partValidator,
  updatePart
);

// Delete a Part by ID
router.delete("/:id", authenticate, authorize("admin"), deletePart);

export default router;
