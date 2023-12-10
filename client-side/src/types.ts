export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  createdAt: string;
  acctNo: string;
  isAdmin: boolean;
  balance: number;
}

export interface ITransaction {
  _id: string;
  amount: number;
  type: string;
  description: string;
  reference: string;
  createdAt: string;
}