import express from "express";
import { login, signup, adminSignup , adminLogin, refreshToken} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.get("/refresh-token", refreshToken);

export default router;