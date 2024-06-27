import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-clients";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const { mutate } = useMutation({
        mutationFn: apiClient.register,
        onSuccess: () => {
            showToast({ message: "Registration Success", type: "SUCCESS" });
            queryClient.invalidateQueries({ queryKey: ["validateToken"] });
            navigate("/");
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
            <h2 className="text-3xl font-bold">Create an account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label
                    htmlFor=""
                    className="text-gray-700 text-sm font-bold flex-1"
                >
                    First Name
                    <input
                        className="border rounded w-full py-1 px-2 font-normal"
                        type="text"
                        {...register("firstName", {
                            required: "This field is required",
                        })}
                    />
                    {errors.firstName && (
                        <span className="text-red-500">
                            {errors.firstName.message}
                        </span>
                    )}
                </label>
                <label
                    htmlFor=""
                    className="text-gray-700 text-sm font-bold flex-1"
                >
                    Last Name
                    <input
                        className="border rounded w-full py-1 px-2 font-normal"
                        type="text"
                        {...register("lastName", {
                            required: "This field is required",
                        })}
                    />
                    {errors.lastName && (
                        <span className="text-red-500">
                            {errors.lastName.message}
                        </span>
                    )}
                </label>
            </div>
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
            <label
                htmlFor=""
                className="text-gray-700 text-sm font-bold flex-1"
            >
                Confirm Password
                <input
                    className="border rounded w-full py-1 px-2 font-normal"
                    type="text"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required";
                            } else if (watch("password") !== val) {
                                return "Your password do not match";
                            }
                        },
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-500">
                        {errors.confirmPassword.message}
                    </span>
                )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Already have account.{" "}
                    <Link className="underline" to={"/sign-in"}>
                        Sign in here
                    </Link>
                </span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
                >
                    Create Account
                </button>
            </span>
        </form>
    );
}
