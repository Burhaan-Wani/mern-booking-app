import { useForm } from "react-hook-form";
import * as apiClient from "../api-clients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../hooks/useAppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
export type SigninFormData = {
    email: string;
    password: string;
};
export default function Signin() {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormData>();

    const { mutate } = useMutation({
        mutationFn: apiClient.signin,
        onSuccess: async () => {
            showToast({ message: "Login Successful", type: "SUCCESS" });
            queryClient.invalidateQueries({ queryKey: ["validateToken"] });
            navigate(location.state.from.pathname || "/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutate(data);
    });
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label
                htmlFor=""
                className="text-gray-700 text-sm font-bold flex-1"
            >
                Email
                <input
                    className="border rounded w-full py-1 px-2 font-normal"
                    type="email"
                    {...register("email", {
                        required: "This field is required",
                    })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label
                htmlFor=""
                className="text-gray-700 text-sm font-bold flex-1"
            >
                Password
                <input
                    className="border rounded w-full py-1 px-2 font-normal"
                    type="text"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be atleast 6 characters",
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">
                        {errors.password.message}
                    </span>
                )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered?{" "}
                    <Link className="underline" to={"/register"}>
                        Create an account here
                    </Link>
                </span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
                >
                    Login
                </button>
            </span>
        </form>
    );
}
