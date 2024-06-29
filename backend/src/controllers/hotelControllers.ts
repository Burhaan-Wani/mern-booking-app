import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/hotel.model";
import { HotelType } from "../utils/types";
import AppError from "../utils/appError";

// createHotel
export const createHotel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        // upload images to cloudinary
        const uploadPromises = imageFiles.map(async (image) => {
            const base64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = `data:${image.mimetype};base64,${base64}`;
            const response = await cloudinary.uploader.upload(dataURI);
            return response.url;
        });
        const imageUrls = await Promise.all(uploadPromises);
        // if successful, add urls to new hotel

        newHotel.imageUrls = imageUrls;
        newHotel.userId = req.userId;

        // save new hotel to DB
        const hotel = await Hotel.create(newHotel);

        // return json response
        res.status(201).json({
            status: "success",
            hotel,
        });
    }
);

// getHotels
export const getHotels = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const hotels = await Hotel.find({ userId: req.userId });
        if (!hotels) {
            return next(
                new AppError("You have not created any hotels yet.", 404)
            );
        }
        res.status(200).json({
            status: "success",
            hotels,
        });
    }
);
