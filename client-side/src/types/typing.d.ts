// PaystackPop is a global object from paystack.js
declare const PaystackPop: {
    setup: (options: {
        key: string;
        email: string;
        amount: number;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
        ref?: string;
    }) => {
        openIframe: () => void;
    };
};

// shape for user
declare type IUser = {
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
declare type ITransaction = {
    id: number;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    reference: string;
    createdAt: string;
    user?: IUser;
    meta: null | {
        customerAddress: string;
        customerName: string;
    };
}

// shape for [user, setUser] context
declare type OutletContextType = [IUser, React.Dispatch<React.SetStateAction<IUser>>];

declare type Operator = {
    desc: string;
    id: string;
    name: string;
    sector: string;
}

declare type CableTvPlan = {
    id: string;
    name: string;
    category: string;
    meta: {
        currency: string;
        fee: string;
    };
}

declare type ICustomer = {
    name: string;
    address: string;
};

declare type UserContextType = {
    user: IUser;
    setUser: (user: IUser) => void
};

declare class Modal {
    constructor(element: HTMLElement);
    static getInstance(element: HTMLElement): Modal;
    show(): void;
    hide(): void;
}

declare class Offcanvas {
    constructor(element: HTMLElement);
    static getInstance(element: HTMLElement): Offcanvas;
    show(): void;
    hide(): void;
}

declare const bootstrap: {
    Modal: typeof Modal;
    Offcanvas: typeof Offcanvas;
};

declare type Device = {
    id: string;
    fullName: string;
    email: string;
    address: string;
    operatoId: string;
    operatorName: string;
    deviceNumber: string;
    createdAt: string;
    operatorSector: string;
}