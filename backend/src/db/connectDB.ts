import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("Error while connecting in connectDB.ts", error);
    }
};

export default connectDB;
