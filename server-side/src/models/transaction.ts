import mongoose from 'mongoose';
import { MODELS, TRX_SERVICES, TRX_TYPES } from '../utils';

const transactionSchema = new mongoose.Schema<ITransaction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.user,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(TRX_TYPES)
    },
    service: {
        type: String,
        required: true,
        enum: Object.values(TRX_SERVICES)
    },
    description: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        unique: true
    },
    serviceProvider: {
        type: String,
        required: true,
        // enum: ['Paystack', 'Wallet2Wallet', 'MTN', 'Airtel', 'Glo', '9mobile', 'PHCN', 'DSTV', 'GOTV', 'Startimes']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.user,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.user,
    },
}, {
    timestamps: true
});

export const Transaction = mongoose.model<ITransaction>(MODELS.transaction, transactionSchema);
