import express from "express";
import { getOverallStatistics, getDetailedStatistics } from "../controllers/statistics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

// GET /api/statistics - Get basic statistics
router.get("/", authorize(["admin"]), getOverallStatistics);

// GET /api/statistics/detailed - Get detailed statistics with insights
router.get("/detailed", authorize(["admin"]), getDetailedStatistics);

export default router;