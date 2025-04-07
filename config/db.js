import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB: ${connection.connection.name}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
