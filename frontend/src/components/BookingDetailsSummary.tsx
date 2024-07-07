import { HotelType } from "../api-clients";

type Props = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    numberOfNights: number;
    hotel: HotelType;
};
export default function BookingDetailsSummary({
    checkIn,
    checkOut,
    adultCount,
    childCount,
    hotel,
    numberOfNights,
}: Props) {
    return (
        <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
            <h2 className="text-xl font-bold">Your Booking Details</h2>
            <div className="border-b py-2">
                Location:
                <div className="font-bold">{`${hotel?.name}, ${hotel?.city}, ${hotel?.country}`}</div>
            </div>
            <div className="flex justify-between">
                <div className="">
                    CheckIn
                    <div className="font-bold">{checkIn.toDateString()}</div>
                </div>
                <div className="">
                    CheckOut
                    <div className="font-bold">{checkOut.toDateString()}</div>
                </div>
            </div>
            <div className="border-t border-b py-2">
                Total length of stay:
                <div className="font-bold">{numberOfNights} nights</div>
            </div>
            <div className="">
                Guests{" "}
                <div className="font-bold">
                    {adultCount} adults & {childCount} children
                </div>
            </div>
        </div>
    );
}
