import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import serviceRoutes from "./routes/service.catalog.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import fuelTypeRoutes from "./routes/fuel.type.routes.js";
import manufacturerRoutes from "./routes/manufacturer.routes.js";
import partRoutes from "./routes/part.routes.js";
import servicePackageRoutes from "./routes/service.package.routes.js";
import garageRoutes from "./routes/garage.routes.js";

import { connectDB } from "./config/db.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:5173",
      "https://garage-admin-delta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/fuel-types", fuelTypeRoutes);
app.use("/manufacturers", manufacturerRoutes);
app.use("/parts", partRoutes);
app.use("/service-packages", servicePackageRoutes);
app.use("/garages", garageRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
});