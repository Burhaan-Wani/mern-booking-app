import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { decode } from "punycode";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies["auth_token"];
        if (!token) {
            return next(new AppError("You are not authorized", 401));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY as string
            );
            req.userId = (decoded as JwtPayload).userId;
            next();
        } catch (error) {
            return next(new AppError("Invalid Token", 401));
        }
    }
);

export default verifyToken;
