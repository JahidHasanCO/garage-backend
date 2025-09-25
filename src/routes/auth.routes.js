import express from "express";
import { adminSignup , adminLogin, refreshToken} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.get("/refresh-token", refreshToken);

export default router;