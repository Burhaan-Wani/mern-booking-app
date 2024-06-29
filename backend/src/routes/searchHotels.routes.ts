import express from "express";
import { searchHotels } from "../controllers/searchHotelControllers";

const router = express.Router({ mergeParams: true });

router.get("/", searchHotels);

export default router;
