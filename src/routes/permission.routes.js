import express from "express";
import { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission } from "../controllers/permission.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get("/", getAllPermissions);

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 */
router.get("/:id", getPermissionById);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               title:
    *                 type: string
    *               value:
    *                 type: string
    *             required:
    *               - title
    *               - value
    *     responses:
    *       201:
    *         description: Permission created
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Permission'
    *       400:
    *         description: Bad request
 */
router.post("/", createPermission);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               value:
 *                 type: string
 *             required:
 *               - title
 *               - value
 *     responses:
 *       200:
 *         description: Permission updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Bad request
 */
router.put("/:id", updatePermission);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       204:
 *         description: Permission deleted
 *       404:
 *         description: Permission not found
 */
router.delete("/:id", deletePermission);

export default router;
