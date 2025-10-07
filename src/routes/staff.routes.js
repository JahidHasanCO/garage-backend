import express from "express";
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createStaffValidator, updateStaffValidator } from "../validators/staff.validator.js";

const router = express.Router();

// All staff routes require authentication
router.use(authenticate);

// Anyone authenticated can view staff lists and details
router.get("/", getAllStaff);
router.get("/:id", getStaffById);

// Only admin or manager can create/update/delete staff
router.post("/", authorize(["admin", "manager"]), createStaffValidator, createStaff);
router.put("/:id", authorize(["admin", "manager"]), updateStaffValidator, updateStaff);
router.delete("/:id", authorize(["admin", "manager"]), deleteStaff);

export default router;
