import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-clients";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../hooks/useSearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";

export default function Booking() {
    const search = useSearchContext();
    const { hotelId } = useParams();
    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    const { data: currentUser } = useQuery({
        queryKey: ["fetchCurrentUser"],
        queryFn: apiClient.getchCurrentUser,
    });

    const { data: hotel } = useQuery({
        queryKey: ["hotelbyId"],
        queryFn: () => apiClient.singleHotelById(hotelId as string),
        enabled: !!hotelId,
    });

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights =
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);
            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkOut, search.checkIn]);

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailsSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel as apiClient.HotelType}
            />
            {currentUser && <BookingForm currentUser={currentUser} />}
        </div>
    );
}
