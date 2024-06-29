import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import Hotel from "../models/hotel.model";
import { HotelSearchResponse } from "../utils/types";

export const searchHotels = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // pagination
        const pageLimit = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page?.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageLimit;
        const hotels = await Hotel.find().skip(skip).limit(pageLimit);

        const total = await Hotel.countDocuments();
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageLimit),
            },
        };
        res.status(200).json(response);
    }
);
