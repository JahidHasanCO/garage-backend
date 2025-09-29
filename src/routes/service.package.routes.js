import express from "express";
import multer from "multer";

import {
  getAllServicePackages,
  getServicePackageById,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
  getNearbyServicePackages,
} from "../controllers/service.package.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createServicePackageValidator, updateServicePackageValidator } from "../validators/service.package.validator.js";

// Setup memory storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public endpoints (any authenticated user)
router.get("/", getAllServicePackages); // supports pagination: ?page=1&limit=10
router.get("/nearby", getNearbyServicePackages);
router.get("/:id", getServicePackageById);

// Admin-only endpoints
router.post(
  "/",
  authorize(["admin"]),
  upload.single("image"),
  createServicePackageValidator,
  createServicePackage
);

router.put(
  "/:id",
  authorize(["admin"]),
  upload.single("image"),
  updateServicePackageValidator,
  updateServicePackage
);

router.delete(
  "/:id",
  authorize(["admin"]),
  deleteServicePackage
);

export default router;
