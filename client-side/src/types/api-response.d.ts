declare type Meta = {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

declare type Links = {
    first: string;
    last: string;
    previous: string;
    next: string;
}

declare type UsersResponse = {
    message: string;
    meta: Meta;
    users: IUser[];
    links: Links;
}

declare type TransactionsResponse = {
    message: string;
    meta: Meta;
    transactions: ITransaction[];
    links: Links;
}

declare type DevicesResponse = {
    message: string;
    meta: Meta;
    devices: IDevice[];
    links: Links;
}