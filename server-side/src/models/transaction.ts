import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema<ITransaction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['credit', 'debit']
    },
    service: {
        type: String,
        required: true,
        enum: ['wallet transfer', 'funding', 'airtime purchase', 'bill payment', 'data purchase']
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
        ref: "User",
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;