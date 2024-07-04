import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "../hooks/useSearchContext";
import * as apiClient from "../api-clients";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesTypesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

export default function Search() {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilties, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>();

    const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = e.target.value;

        setSelectedStars((prevStars) =>
            e.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
    };
    const handleHotelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = e.target.value;

        setSelectedHotelTypes((prevHotelType) =>
            e.target.checked
                ? [...prevHotelType, hotelType]
                : prevHotelType.filter((typeHotel) => typeHotel !== hotelType)
        );
    };
    const handleFaciltiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const facility = e.target.value;

        setSelectedFacilities((prevFacilities) =>
            e.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter(
                      (prevFacility) => prevFacility !== facility
                  )
        );
    };

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilties,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    };
    const { data: hotelData } = useQuery({
        queryKey: ["searchHotels", searchParams],
        queryFn: () => apiClient.searchHotels(searchParams),
    });
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by:
                    </h3>
                    <StarRatingFilter
                        selectedStars={selectedStars}
                        onChange={handleStarsChange}
                    />
                    <HotelTypesFilter
                        selectedHotelTypes={selectedHotelTypes}
                        onChange={handleHotelTypeChange}
                    />
                    <FacilitiesTypesFilter
                        selectedFacilities={selectedFacilties}
                        onChange={handleFaciltiesChange}
                    />
                    <PriceFilter
                        selectedPrice={selectedPrice}
                        onChange={(value?: number) => setSelectedPrice(value)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotel found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">
                            Price Per Night (low to high)
                        </option>
                        <option value="pricePerNightDesc">
                            Price Per Night (high to low)
                        </option>
                    </select>
                </div>
                {hotelData?.data.map((hotel) => (
                    <SearchResultsCard hotel={hotel} />
                ))}
                <div className="">
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}
