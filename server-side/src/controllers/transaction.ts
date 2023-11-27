import { Request, Response } from "express";
import Transaction from "../models/transaction";
import * as validators from "../utils/validators";
import { calcBalance, verifyTransaction } from "../utils/utils";

export async function fundWallet(req: Request, res: Response) {
  try {
    const user = req.user.id;
    const { reference } = req.body;

    const processed = await Transaction.findOne({ reference });
    if (processed) {
      res.status(409);
      return res.json({
        message: 'Stale transaction',
        error: 'This transaction has already been processed',
      });
    }

    const response = await verifyTransaction(reference);

    if (!response.status) {
      res.status(422);
      return res.json({
        success: false,
        message: "Transaction failed",
        error: "Could not confirm transaction"
      })
    }

    const {amount} = response.data;

    await Transaction.create({
      amount,
      reference,
      bankName: 'Sure Banker',
      accountName: 'FinEase',
      isCredit: true,
      user,
      type: 'fund wallet',
    });

    res.status(201);
    return res.json({
      success: true,
      message: "Wallet funded successfully",
      amount,
      balance: await calcBalance(user)
    });
  }

  catch (error: any) {
    console.error(error.message);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}