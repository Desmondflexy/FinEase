// shape for user
export type IUser = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    createdAt: string;
    acctNo: string;
    isAdmin: boolean;
    balance: number;
}

// shape for transaction
export type ITransaction = {
    id: number;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    reference: string;
    createdAt: string;
    user?: IUser;
}

// shape for [user, setUser] context
export type OutletContextType = [IUser, React.Dispatch<React.SetStateAction<IUser>>];

export type IDisco = {
    desc: string;
    id: string;
    name: string;
}

export enum ApiStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}