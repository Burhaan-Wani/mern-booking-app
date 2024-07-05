import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-clients";
import { AiFillStar } from "react-icons/ai";

export default function Detail() {
    const { hotelId } = useParams();
    const { data: hotel } = useQuery({
        queryKey: ["hotel"],
        queryFn: () => apiClient.singleHotelById(hotelId as string),
        enabled: !!hotelId,
    });

    console.log(hotel);
    // display empty fragment while hotel data is being loaded
    if (!hotel) {
        return <>Loading...</>;
    }
    return (
        <div className="space-y-6">
            <div className="">
                <span className="flex">
                    {Array.from({
                        length: hotel?.starRating,
                    }).map(() => (
                        <AiFillStar className="fill-yellow-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>
            <div className="grid grcol1 lg:grid-cols-3 gap-4">
                {hotel.imageUrls.map((image) => (
                    <div className="h-[300px]">
                        <img
                            src={image}
                            alt={hotel.name}
                            className="rounded-lg w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility) => (
                    <div className="border border-slate-300 rounded-sm  p-3">
                        {facility}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols=[2fr_1fr]">
                <div className="whitespace-pre-line">{hotel.description}</div>
                <div className="h-fit">{/* <GuestInfo /> */}</div>
            </div>
        </div>
    );
}
