import express from "express";
import {
  getMyBookings,
  createBooking,
  getBookingById,
  cancelBooking,
  updateBooking,
  getAllBookings
} from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/my", authenticate, authorize(["customer"]), getMyBookings);
router.post("/", authenticate, authorize(["customer", "admin"]), createBooking);
router.get("/:id", authenticate, authorize(["customer", "admin"]), getBookingById);
router.put("/:id", authenticate, authorize(["customer", "admin"]), updateBooking);
router.delete("/:id", authenticate, authorize(["customer", "admin"]), cancelBooking);
router.get("/", authenticate, authorize(["admin"]), getAllBookings);

export default router;
