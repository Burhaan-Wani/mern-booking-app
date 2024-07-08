import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-clients";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../hooks/useSearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../hooks/useAppContext";

export default function Booking() {
    const search = useSearchContext();
    const { stripePromise } = useAppContext();

    const { hotelId } = useParams();
    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    const { data: currentUser } = useQuery({
        queryKey: ["fetchCurrentUser"],
        queryFn: apiClient.getchCurrentUser,
    });

    const { data: paymentIntentData } = useQuery({
        queryKey: ["paymentIntent"],
        queryFn: () =>
            apiClient.createPaymentIntent(
                hotelId as string,
                numberOfNights.toString()
            ),
        enabled: !!hotelId && numberOfNights > 0,
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

    if (!hotel) {
        return <></>;
    }
    return (
        <div className="grid md:grid-cols-[1fr_2fr] gap-3">
            <BookingDetailsSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData && (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: paymentIntentData.clientSecret,
                    }}
                >
                    <BookingForm
                        currentUser={currentUser}
                        paymentIntent={paymentIntentData}
                    />
                </Elements>
            )}
        </div>
    );
}
