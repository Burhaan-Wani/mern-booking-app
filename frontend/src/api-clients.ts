import { BookinFormData } from "./forms/BookingForm/BookingForm";
import { RegisterFormData } from "./pages/Register";
import { SigninFormData } from "./pages/Signin";

export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
};

export type PaymentIntentResponse = {
    status: "success";
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
};
type GetHotelsType = {
    status: "success";
    hotels: HotelType[];
};

type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
};

export type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string | undefined;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Error while fetching user");
    }
    return data.user;
};

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

export const getHotels = async (): Promise<GetHotelsType> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hotels`, {
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const getHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hotels/${hotelId}`, {
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Error while fetching hotel");
    }
    return data.hotel;
};

export const singleHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/hotels/detail/${hotelId}`,
        {
            credentials: "include",
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Error while fetching hotel");
    }
    return data.hotel;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/hotels/${hotelFormData.get("hotelId")}`,
        {
            method: "PUT",
            credentials: "include",
            body: hotelFormData,
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to update Hotel");
    }
    return data;
};

type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
};

export const searchHotels = async (
    searchParams: SearchParams
): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(
        `${API_BASE_URL}/api/v1/hotels/search?${queryParams}`
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Error while fetching hotels");
    }
    return data;
};

export const createPaymentIntent = async (
    hotelId: string,
    numberOfNights: string
): Promise<PaymentIntentResponse> => {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/hotels/${hotelId}/bookings/payment-intent`,
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ numberOfNights }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (!response.ok) {
        throw new Error("Error fetching payment intent");
    }
    return await response.json();
};

export const createBooking = async (formData: BookinFormData) => {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/hotels/${formData.hotelId}/bookings`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }
    );
    if (!response.ok) {
        throw new Error("Error while booking room");
    }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/my-bookings`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to fetch bookings");
    }

    return await response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/hotels/all`);
    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }
    return await response.json();
};
