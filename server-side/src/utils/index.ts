import { Request } from "express";
import { User, Transaction } from "../models";
import Joi from "joi";

export async function generateAcctNo() {
    let acctNo = Math.floor(Math.random() * 10000000000);
    let user = await User.findOne({ acctNo });
    while (user) {
        acctNo = Math.floor(Math.random() * 10000000000);
        user = await User.findOne({ acctNo });
    }
    return String(acctNo);
}

export async function generateReference(prefix: string) {
    let ref = Math.floor(Math.random() * 10000000000);
    let trx = await Transaction.findOne({ reference: prefix + ref });
    while (trx) {
        ref = Math.floor(Math.random() * 10000000000);
        trx = await Transaction.findOne({ reference: prefix + ref });
    }
    return prefix + ref;
}

export async function calcBalance(user: string) {
    try {
        const transactions = await Transaction.find({ user });
        const balance = transactions.reduce((acc, curr) => {
            if (curr.type === 'credit') return acc + curr.amount;
            return acc - curr.amount;
        }, 0);
        return balance;
    } catch (error) {
        console.log(error);
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


/**Used during user registration to check if the value of a given field has not been taken. */
export async function isFieldAvailable(field: string, value: string) {
    const found = Boolean(await User.findOne({ [field]: value }));
    return !found;
}

/** Always throw this error object */
export function appError(statusCode: number, message: string) {
    return { statusCode, message }
}

/**Validates request data (body, query or params) against schema. Returns request data if valid otherwise throws an error */
export function validateRequestData(req: Request, validatorSchema: Joi.ObjectSchema<any>, reqType: 'body' | 'query' | 'params' = 'body') {
    const { error } = validatorSchema.validate(req[reqType]);
    if (error) throw appError(400, error.message);
    return req[reqType];
}
