import mongoose from "mongoose";
import { MODELS, TOKEN_TYPES } from "../utils";

const tokenSchema = new mongoose.Schema<IToken>(
    {
        email: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(TOKEN_TYPES),
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

export const Token = mongoose.model<IToken>(MODELS.token, tokenSchema);
