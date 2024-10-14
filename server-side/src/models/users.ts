import mongoose from 'mongoose';
import { MODELS } from '../utils/constants';

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    acctNo: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>(MODELS.user, userSchema);

export default User;