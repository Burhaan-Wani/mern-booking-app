import express, { Request, Response } from "express";
import Hotel from "../models/hotel.model";
import { HotelType } from "../utils/types";
import verifyToken from "../middlewares/authMiddleware";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId } },
        });

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId === req.userId
            );

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
});

export default router;
