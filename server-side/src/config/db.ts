import mongoose from "mongoose";

async function connectDb() {
    const databaseUrl = process.env.NODE_ENV === 'development'
        ? 'mongodb://localhost:27017/finEase'
        : process.env.DATABASE_URL as string;
    try {
        await mongoose.connect(databaseUrl);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed', error);
    }
}

export default connectDb;