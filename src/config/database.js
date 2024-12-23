import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI; 
        if (!uri) {
            throw new Error("La URI de MongoDB no está definida");
        }

        await mongoose.connect(uri);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
    }
};

export default connectDB;