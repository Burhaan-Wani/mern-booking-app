import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/user.model";
import AppError from "../utils/appError";
import { validationResult } from "express-validator";

// Register
export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMsgs = errors
                .array()
                .map((el) => el.msg)
                .join(" .");
            return next(new AppError(errMsgs, 400));
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return next(
                new AppError("User with this email already exists", 400)
            );
        }
        user = await User.create(req.body);

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        res.status(201)
            .cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                status: "success",
                message: "User registered successfully",
            });
    }
);

// Login
export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMsgs = errors
                .array()
                .map((el) => el.msg)
                .join(" .");
            return next(new AppError(errMsgs, 400));
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user?.passwordMatch(password))) {
            return next(new AppError("Email or Password is incorrect", 401));
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        res.status(200)
            .cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                status: "success",
                userId: user._id,
            });
    }
);

export const logout = catchAsync(async (req, res, next) => {
    res.status(200)
        .cookie("auth_token", "", {
            expires: new Date(0),
        })
        .json({
            status: "success",
            message: "Logout Successfully",
        });
});

export const verifyTokenResponse = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ userId: req.userId });
    }
);
