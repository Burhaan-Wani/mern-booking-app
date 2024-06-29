import { RegisterFormData } from "./pages/Register";
import { SigninFormData } from "./pages/Signin";
import { HotelType } from "../../backend/src/utils/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const signin = async (formData: SigninFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during sign out");
    }
    return await response.json();
};

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }
    const data = await response.json();
    return data;
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to add Hotel");
    }
    return data;
};

export const getHotels = async (): Promise<{
    status: "success";
    hotels: HotelType[];
}> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hotels`, {
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};
