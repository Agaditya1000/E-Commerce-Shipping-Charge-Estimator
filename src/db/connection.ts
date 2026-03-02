import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-shipping';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${MONGODB_URI}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
}
