import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/user.model";
import AppError from "../utils/appError";

export const getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        user.password = undefined;
        res.status(200).json({
            status: "success",
            user,
        });
    }
);
