import express from "express";
import {
    getAllServicePackages,
    getServicePackageById,
    createServicePackage,
    updateServicePackage,
    deleteServicePackage,
} from "../controllers/service.package.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createServicePackageValidator, updateServicePackageValidator } from "../validators/service.package.validator.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public endpoints
// Supports pagination with ?page=1&limit=10
router.get("/", getAllServicePackages);
router.get("/:id", getServicePackageById);

// Admin-only endpoints
router.post("/", authorize(["admin"]), upload.single("image"), createServicePackageValidator, createServicePackage);
router.put("/:id", authorize(["admin"]), upload.single("image"), updateServicePackageValidator, updateServicePackage);
router.delete("/:id", authorize(["admin"]), deleteServicePackage);

export default router;
