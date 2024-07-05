import express from "express";
import {
    login,
    logout,
    register,
    verifyTokenResponse,
} from "../controllers/authControllers";
import { check } from "express-validator";
import verifyToken from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
    "/register",
    [
        check("firstName", "FirstName is required").isString(),
        check("lastName", "LastName is required").isString(),
        check("email", "Email is required").isEmail(),
        check(
            "password",
            "Password with 6 or more characters is required"
        ).isLength({ min: 6 }),
    ],
    register
);
router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check(
            "password",
            "Password with 6 or more characters required"
        ).isLength({
            min: 6,
        }),
    ],
    login
);
router.post("/logout", logout);
router.get("/validate-token", verifyToken, verifyTokenResponse);

export default router;
