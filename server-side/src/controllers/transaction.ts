import { Request, Response } from "express";
import Transaction from "../models/transaction";
import * as validators from "../utils/validators";
import { calcBalance, verifyTransaction, generateReference } from "../utils/utils";
import User from "../models/users";

export async function fundWallet(req: Request, res: Response) {
  try {
    const user = req.user.id;
    const { reference } = req.body;

    const processed = await Transaction.findOne({ reference });
    if (processed) {
      res.status(409);
      return res.json({
        success: false,
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

    const { amount } = response.data;

    await Transaction.create({
      user,
      amount,
      type: 'credit',
      service: 'funding',
      description: 'Funding via Paystack',
      reference,
      serviceProvider: 'Paystack',
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

export async function transferFunds(req: Request, res: Response) {
  const user = req.user.id;

  try {
    const { error } = validators.transferFunds.validate(req.body, validators.options);

    if (error) {
      res.status(400);
      return res.json({
        success: false,
        message: error.message,
        error: 'Bad request'
      });
    }

    // eslint-disable-next-line prefer-const
    let { acctNoOrUsername, amount } = req.body;
    amount *= 100;  // convert to kobo

    const requiredInfo = 'username fullName email phone';
    const recipient = await User.findOne({ acctNo: acctNoOrUsername }).select(requiredInfo) || await User.findOne({ username: acctNoOrUsername }).select(requiredInfo);

    // check if recipient exists
    if (!recipient) {
      res.status(404);
      return res.json({
        success: false,
        message: 'Recipient not found!',
        error: 'Not found'
      });
    }

    // check if sender has sufficient balance
    const userBalance = await calcBalance(user);
    if (userBalance < amount) {
      res.status(402);
      return res.json({
        success: false,
        message: 'You do not have enough funds',
        error: 'Insufficient funds'
      });
    }

    if (recipient.id === user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'Cannot transfer funds to self',
        error: 'Conflict'
      })
    }

    // create debit transaction
    const transaction = await Transaction.create({
      user,
      amount,
      type: 'debit',
      service: 'wallet transfer',
      description: `Wallet transfer to ${recipient.username}`,
      reference: await generateReference('WTR'),
      serviceProvider: 'Wallet2Wallet',
      recipient: recipient._id,
    });

    // create credit transaction
    await Transaction.create({
      user: recipient._id,
      amount,
      type: 'credit',
      service: 'wallet transfer',
      description: `Wallet transfer from ${req.user.username}`,
      reference: await generateReference('RW'),
      serviceProvider: 'Wallet2Wallet',
      sender: user,
    });

    return res.json({
      success: true,
      message: `Funds sent to ${recipient.username} successfully!`,
      balance: await calcBalance(user),
      amount: amount / 100,
      reference: transaction.reference,
    });

  }

  catch (err: any) {
    console.error(err.message)
    res.status(500);
    return res.json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const user = req.user.id;
    const requiredInfo = 'amount type reference createdAt description';
    const transactions = await Transaction.find({ user }).sort({ createdAt: -1 }).select(requiredInfo);

    res.status(200);
    return res.json({
      success: true,
      message: `Transaction history for ${req.user.username}`,
      transactions
    });

  } catch (error: any) {
    console.error(error.message);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}