import Transaction from "../models/transaction";
import User from "../models/users";
import axios from "axios";

export async function generateAcctNo() {
  let acctNo = Math.floor(Math.random() * 10000000000);
  let user = await User.findOne({ acctNo });
  while (user) {
    acctNo = Math.floor(Math.random() * 10000000000);
    user = await User.findOne({ acctNo });
  }
  return String(acctNo);
}

export async function generateReference(prefix: string){
  let ref = Math.floor(Math.random() * 10000000000);
  let trx = await Transaction.findOne({reference: prefix + ref});
  while (trx){
    ref = Math.floor(Math.random() * 10000000000);
    trx = await Transaction.findOne({reference: prefix + ref});
  }
  return prefix + ref;
}

export async function calcBalance(user: string) {
  try {
    const transactions = await Transaction.find({ user });
    const balance = transactions.reduce((acc, curr) => {
      if (curr.isCredit) return acc + curr.amount;
      return acc - curr.amount;
    }, 0);
    return balance;
  } catch (error) {
    throw new Error("Error getting balance");
  }
}

export async function runCommand() {
  try {
    const users = await User.find();
    // for (const user of users) {
    //   if (user.balance) continue;
    //   user.balance = 0;
    //   await user.save();
    // }
  }
  catch (error: any) {
    console.log(error);
  }
}


export async function verifyTransaction(ref: string) {
  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
  }
  const url = `https://api.paystack.co/transaction/verify/${ref}`;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  }
  catch {
    throw new Error("Error verifying transaction");
  }
}