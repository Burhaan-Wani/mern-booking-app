import express from "express";
import {
    createHotel,
    getHotel,
    getHotels,
    updateHotel,
} from "../controllers/hotelControllers";
import { upload } from "../middlewares/multer";
import verifyToken from "../middlewares/authMiddleware";
import { body } from "express-validator";
import searchRoutes from "./searchHotels.routes";

const router = express.Router();

// nesting routes
router.use("/search", searchRoutes);

router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage("Price per night is required and must be a number"),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage("Facilities are required"),
    ],
    upload.array("imageFiles", 6),
    createHotel
);

router.get("/", verifyToken, getHotels);
router.get("/:hotelId", verifyToken, getHotel);
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), updateHotel);

export default router;
