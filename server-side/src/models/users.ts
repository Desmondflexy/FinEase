import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

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
  }
}, {
  timestamps: true
})

const User = mongoose.model<IUser>('User', userSchema);

export default User;