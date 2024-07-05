import { createContext, useState } from "react";

export type SearchContextType = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId?: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number
    ) => void;
};

export const SearchContext = createContext<SearchContextType | undefined>(
    undefined
);

export const SearchContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [destination, setDestination] = useState<string>(() => {
        return sessionStorage.getItem("destination") || "";
    });
    const [checkIn, setCheckIn] = useState<Date>(() => {
        return new Date(
            sessionStorage.getItem("checkIn") || new Date().toISOString()
        );
    });
    const [checkOut, setCheckOut] = useState<Date>(() => {
        return new Date(
            sessionStorage.getItem("checkOut") || new Date().toISOString()
        );
    });
    const [adultCount, setadultCount] = useState<number>(() =>
        parseInt(sessionStorage.getItem("adultCount") || "1")
    );
    const [childCount, setChildCount] = useState<number>(() =>
        parseInt(sessionStorage.getItem("childCount") || "0")
    );
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelId") || ""
    );

    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string
    ) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setadultCount(adultCount);
        setChildCount(childCount);
        if (hotelId) {
            setHotelId(hotelId);
        }
        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());

        if (hotelId) {
            sessionStorage.setItem("hotelId", hotelId);
        }
    };
    return (
        <SearchContext.Provider
            value={{
                adultCount,
                checkIn,
                checkOut,
                childCount,
                destination,
                hotelId,
                saveSearchValues,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
