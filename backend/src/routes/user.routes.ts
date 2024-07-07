import express from "express";
import verifyToken from "../middlewares/authMiddleware";
import { getMe } from "../controllers/userControllers";

const router = express.Router();

router.get("/me", verifyToken, getMe);
export default router;
