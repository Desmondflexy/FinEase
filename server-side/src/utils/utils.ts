import { Response } from "express";
import db from "../models";
import axios from "axios";

export async function generateAcctNo() {
    let acctNo = Math.floor(Math.random() * 10000000000);
    let user = await db.User.findOne({ acctNo });
    while (user) {
        acctNo = Math.floor(Math.random() * 10000000000);
        user = await db.User.findOne({ acctNo });
    }
    return String(acctNo);
}

export async function generateReference(prefix: string) {
    let ref = Math.floor(Math.random() * 10000000000);
    let trx = await db.Transaction.findOne({ reference: prefix + ref });
    while (trx) {
        ref = Math.floor(Math.random() * 10000000000);
        trx = await db.Transaction.findOne({ reference: prefix + ref });
    }
    return prefix + ref;
}

export async function calcBalance(user: string) {
    try {
        const transactions = await db.Transaction.find({ user });
        const balance = transactions.reduce((acc, curr) => {
            if (curr.type === 'credit') return acc + curr.amount;
            return acc - curr.amount;
        }, 0);
        return balance;
    } catch (error) {
        throw new Error("Error getting balance");
    }
}

// 20 digit electricity token for testing, not real
export function generateRandomToken() {
    const arr = [];
    for (let i = 0; i < 5; i++) {
        const num = Math.floor(Math.random() * 10000);
        const str = num.toString().padStart(4, '0');
        arr.push(str);
    }
    return arr.join('-');
}


export async function verifyTransaction(ref: string) {
    const authorizationHeaders = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
    const url = `https://api.paystack.co/transaction/verify/${ref}`;
    try {
        const response = await axios.get(url, authorizationHeaders);
        return response.data;
    }
    catch {
        throw new Error("Error verifying transaction");
    }
}

/**Used during user registration to check if the value of a given field has not been taken. */
export async function isFieldAvailable(field: string, value: string) {
    const found = Boolean(await db.User.findOne({ [field]: value }));
    return !found;
}

export function errorHandler(error: any, res: Response) {
    console.error(error);
    res.status(500)
    return res.json({
        success: false,
        message: "Internal Server Error",
        error: error.message
    })
}