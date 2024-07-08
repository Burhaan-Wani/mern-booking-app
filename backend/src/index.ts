import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./db//connectDB";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import hotelRoutes from "./routes/hotel.routes";
import bookingRoutes from "./routes/myBooking.routes";

import { AppError } from "./utils/types";

dotenv.config({
    path: "./.env",
});

// CLOUDINARY Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
// Global Error Handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

app.listen(7000, async () => {
    connectDB();
    console.log(`Server running on http://localhost:7000`);
});
