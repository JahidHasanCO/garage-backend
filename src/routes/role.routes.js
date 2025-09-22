import express from "express";
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from "../controllers/role.controller.js";

const router = express.Router();

router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
