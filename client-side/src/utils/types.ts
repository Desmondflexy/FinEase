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

export type Operator = {
    desc: string;
    id: string;
    name: string;
    sector: string;
}

export enum ApiStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export type CableTvPlan = {
    id: string;
    name: string;
    category: string;
    meta: {
        currency: string;
        fee: string;
    };
}

export type ICustomer = {
    name: string;
    address: string;
};

export type UserContextType = {
    user: IUser;
    setUser: (user: IUser) => void
};