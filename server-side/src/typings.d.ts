declare namespace Express {
    interface Request {
        user: IPayload;
    }
}

interface IPayload {
    id: string;
    isAdmin: boolean;
    username: string;
}

interface IToken extends mongoose.Document {
    email: string;
    // otp: string;
    type: string;
    expires: Date;
}

interface ITransaction extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    type: string;
    service: string;
    description: string;
    reference: string;
    serviceProvider: string;
    sender?: mongoose.Types.ObjectId;
    recipient?: mongoose.Types.ObjectId;
    // more fields to be added as we go on
}

interface IUser extends mongoose.Document {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    acctNo: string;
    isAdmin: boolean;
    username: string;
    emailVerified: boolean;
    // emailVerificationToken: string;
    _id: string;
}

interface IReqHeadersConfig {
    headers: {
        Authorization: string;
    }
}