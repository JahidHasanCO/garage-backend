import express from "express";
import { signupValidator, loginValidator } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { login, signup, adminSignup , adminLogin, refreshToken} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);

router.post("/login", loginValidator, validate, login);

router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.get("/refresh-token", refreshToken);

export default router;