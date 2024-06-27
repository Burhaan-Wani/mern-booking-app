import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./db//connectDB";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { AppError } from "./utils/types";
import path from "path";

dotenv.config({
    path: "./.env",
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
