import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    passwordMatch: (password: string) => Promise<boolean>;
};

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        firstName: {
            type: String,
            required: [true, "firstName is required"],
        },
        lastName: {
            type: String,
            required: [true, "lastName is required"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.passwordMatch = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserType>("User", userSchema);

export default User;
