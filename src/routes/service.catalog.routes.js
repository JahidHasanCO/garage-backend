import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.catalog.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createServiceCatalogValidator, updateServiceCatalogValidator } from "../validators/service.catalog.validator.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public endpoints
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Admin-only endpoints
router.post("/", authorize(["admin"]), upload.single("image"), createServiceCatalogValidator, createService);
router.put("/:id", authorize(["admin"]), upload.single("image"), serviceCatalogValidator, updateService);
router.delete("/:id", authorize(["admin"]), deleteService);

export default router;
