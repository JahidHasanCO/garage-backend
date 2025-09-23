import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import { connectDB } from "./config/db.js";
import setupSwagger from './config/swagger.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // allow cookies / auth headers
  })
);


// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);

setupSwagger(app);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
});