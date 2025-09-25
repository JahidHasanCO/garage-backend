import express from "express";
import { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission } from "../controllers/permission.controller.js";

const router = express.Router();

router.get("/", getAllPermissions);
router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;
