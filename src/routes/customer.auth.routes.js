import express from "express";
import { login, signup } from "../controllers/customer.auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer authentication and profile management
 */

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass@123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Customer logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 user:
 *                   type: object
 *                   description: User details
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role_id:
 *                       type: string
 *                 profile:
 *                   type: object
 *                   description: Customer profile
 *                   properties:
 *                     address:
 *                       type: string
 *       400:
 *         description: Invalid email or password
 *       403:
 *         description: Access denied (not a customer)
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /customer/signup:
 *   post:
 *     summary: Customer signup
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass@123
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Dhaka"
 *               phone:
 *                 type: string
 *                 example: "+8801712345678"
 *             required:
 *               - name
 *               - email
 *               - password
 *               - address
 *               - phone
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer created successfully
 *                 userId:
 *                   type: string
 *       400:
 *         description: Email already exists or validation error
 *       500:
 *         description: Server error
 */
router.post("/signup", signup);

export default router;
