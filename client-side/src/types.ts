// shape for user
export interface IUser {
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
export interface ITransaction {
    id: number;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    reference: string;
    createdAt: string;
}

// shape for [user, setUser] context
export type OutletContextType = [IUser, React.Dispatch<React.SetStateAction<IUser>>];

export interface IDisco {
    desc: string;
    id: string;
    name: string;
}