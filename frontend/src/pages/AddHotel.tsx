import { useMutation } from "@tanstack/react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../hooks/useAppContext";
import * as apiClient from "../api-clients";

export default function AddHotel() {
    const { showToast } = useAppContext();
    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) => apiClient.addMyHotel(data),
        onSuccess: () => {
            showToast({ message: "Hotel Saved", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Error While Saving Hotel", type: "ERROR" });
        },
    });

    const handleSave = (HotelFormData: FormData) => {
        mutate(HotelFormData);
    };
    return <ManageHotelForm onSave={handleSave} isLoading={isPending} />;
}
