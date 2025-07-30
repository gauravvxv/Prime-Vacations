import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

export const connect = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("MongoDB Connected")
    } catch (error) {
         console.error('MongoDB connection failed:', error);
    }
}