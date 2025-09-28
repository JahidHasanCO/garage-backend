import express from "express";
import multer from "multer";
import {
  getAllGarages,
  getGarageById,
  createGarage,
  updateGarage,
  deleteGarage,
} from "../controllers/garage.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createGarageValidator, updateGarageValidator } from "../validators/garage.validator.js";

// Setup multer for memory storage (used in Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public endpoints
router.get("/", getAllGarages);
router.get("/:id", getGarageById);

// Admin-only endpoints
router.post("/", authorize(["admin"]), upload.single("image"), createGarageValidator, createGarage);
router.put("/:id", authorize(["admin"]), upload.single("image"), updateGarageValidator, updateGarage);
router.delete("/:id", authorize(["admin"]), deleteGarage);

export default router;
