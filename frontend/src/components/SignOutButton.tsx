import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-clients";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";

export default function SignOutButton() {
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: apiClient.logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["validateToken"] });
            showToast({ message: "Signed Out Successfully!", type: "SUCCESS" });
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const handleClick = () => {
        mutate();
    };
    return (
        <div
            className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 flex items-center cursor-pointer"
            onClick={handleClick}
        >
            Sign Out
        </div>
    );
}
