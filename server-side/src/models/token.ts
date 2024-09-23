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

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
