import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service_catalog.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(authenticate);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authenticate, authorize(["admin"]), upload.single("image"), createService);
router.delete("/:id", authenticate, authorize(["admin"]), deleteService);

export default router;
