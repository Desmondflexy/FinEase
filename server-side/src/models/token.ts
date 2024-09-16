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
            type: Number,
        },
        token: {
            type: String,
            required: true,
        }
    }
);

export default mongoose.model<IToken>("Token", tokenSchema);
