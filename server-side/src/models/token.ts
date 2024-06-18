import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema<IToken>(
    {
        email: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["email", "password"],
        },
        expires: {
            type: Date,
            required: true,
            default: Date.now() + 10 * 60 * 1000, // 10mins for password reset
        },
    }
);

export default mongoose.model<IToken>("Token", tokenSchema);
