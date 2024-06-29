import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiCLient from "../api-clients";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../hooks/useAppContext";

export default function EditHotel() {
    const { showToast } = useAppContext();
    const { hotelId } = useParams();
    const { data: hotel, refetch } = useQuery({
        queryKey: ["fetchHotelById"],
        queryFn: () => apiCLient.getHotelById(hotelId || ""),
        enabled: !!hotelId,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) => apiCLient.updateMyHotelById(data),
        onSuccess: () => {
            showToast({ message: "Hotel updated", type: "SUCCESS" });
            refetch();
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return (
        <ManageHotelForm
            hotel={hotel}
            onSave={handleSave}
            isLoading={isPending}
        />
    );
}
