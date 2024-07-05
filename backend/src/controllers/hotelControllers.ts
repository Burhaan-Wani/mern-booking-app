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
        const imageUrls = await uploadImages(imageFiles);
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

// Get hotel for signed user
export const getHotel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.hotelId;
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
        if (!hotel) {
            return next(new AppError("Hotel not found", 404));
        }
        res.status(200).json({
            status: "success",
            hotel,
        });
    }
);

// get hotel
export const hotel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.hotelId;
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return next(new AppError("Hotel not found", 404));
        }
        res.status(200).json({
            status: "success",
            hotel,
        });
    }
);

// update hotel
export const updateHotel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const updatedHotel: HotelType = req.body;
        const hotel = await Hotel.findOneAndUpdate(
            {
                _id: req.params.hotelId,
                userId: req.userId,
            },
            updatedHotel,
            { new: true }
        );

        if (!hotel) {
            return next(new AppError("Hotel not found", 404));
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];

        await hotel.save();
        res.status(201).json({
            status: "success",
            hotel,
        });
    }
);

// upload Images to cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = `data:${image.mimetype};base64,${base64}`;
        const response = await cloudinary.uploader.upload(dataURI);
        return response.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
