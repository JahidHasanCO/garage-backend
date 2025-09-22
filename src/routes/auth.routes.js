import express from "express";
import { signup , adminLogin, refreshToken} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/admin/login", adminLogin);
router.get("/refresh-token", refreshToken);

// router.get("/profile", authenticate, (req, res) => {
//   res.json({ user: req.user });
// });

export default router;