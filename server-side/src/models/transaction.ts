import mongoose from 'mongoose';

interface ITransaction extends mongoose.Document{
  amount: number;
  isCredit: boolean;
  user: mongoose.Types.ObjectId;
  reference?: string;
  type: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  isCredit: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reference: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;