import { Request, Response } from "express";
import database from "../models";
import * as validators from "../utils/validators";
import { calcBalance, verifyTransaction, generateReference, errorHandler } from "../utils/utils";
import { blocApi } from "../utils/blochq-api";
import { phoneNetworks } from "../utils/constants";
import bcrypt from 'bcryptjs';

const { Transaction, User } = database;

class TransactionController {
    async getTransactions(req: Request, res: Response) {
        try {
            const user = req.user.id;
            const requiredInfo = 'amount type reference createdAt description';
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;
            const transactions = await Transaction
                .find({ user })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit)
                .select(requiredInfo);

            const totalTransactions = await Transaction.countDocuments({ user })

            return res.json({
                success: true,
                message: `Transaction history for ${req.user.username}`,
                transactionCount: transactions.length,
                totalTransactions,
                totalPages: Math.ceil(totalTransactions / limit),
                transactions
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async fundWallet(req: Request, res: Response) {
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
        } catch (error) {
            errorHandler(error, res);
        }
    }

    async transferFunds(req: Request, res: Response) {
        const userId = req.user.id;

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

            const { acctNoOrUsername } = req.body;
            const amount = req.body.amount * 100;  // convert to kobo
            const password = req.body.password;

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
            const userBalance = await calcBalance(userId);
            if (userBalance < amount) {
                res.status(402);
                return res.json({
                    success: false,
                    message: 'You do not have enough funds',
                    error: 'Insufficient funds'
                });
            }

            if (recipient.id === userId) {
                res.status(409);
                return res.json({
                    success: false,
                    message: 'Cannot transfer funds to self',
                    error: 'Conflict'
                })
            }

            // authenticate transaction
            const user = await User.findById(userId) as IUser;
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(401);
                return res.json({
                    message: 'Password is incorrect',
                    error: 'Unauthorized'
                });
            }

            // create debit transaction
            const transaction = await Transaction.create({
                user: userId,
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
                sender: userId,
            });

            return res.json({
                success: true,
                message: `Funds sent to ${recipient.username} successfully!`,
                balance: await calcBalance(userId),
                amount: amount / 100,
                reference: transaction.reference,
            });
        } catch (error) {
            errorHandler(error, res);
        }
    }

    async getNetworks(req: Request, res: Response) {
        try {
            const networks = await blocApi.getOperators('telco');
            return res.json({
                success: true,
                message: 'Telecom operators',
                networks
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    getPhoneNetwork(req: Request, res: Response) {
        const phone = req.query.phone as string;
        const network = phoneNetworks[phone.slice(0, 4)];

        if (!network) {
            res.status(404);
            return res.json({
                success: false,
                message: `Cannot determine network for ${phone}`,
                error: 'Network not found',
            });
        }

        return res.json({
            success: true,
            network,
            phone,
        })
    }

    async getDataPlans(req: Request, res: Response) {
        try {
            const operatorId = req.query.operatorId as string;
            const dataPlans = await blocApi.getDataPlans(operatorId);
            res.json({
                success: true,
                message: 'Data plans',
                dataPlans
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async buyAirtime(req: Request, res: Response) {
        try {
            const user = req.user.id;
            const { error } = validators.rechargeAirtime.validate(req.body, validators.options);

            if (error) {
                res.status(400);
                return res.json({
                    success: false,
                    message: error.message,
                    error: 'Bad request'
                });
            }

            const { operatorId, phone } = req.body;
            const amount = req.body.amount * 100;

            const userBalance = await calcBalance(user);
            if (userBalance < amount) {
                res.status(402);
                return res.json({
                    success: false,
                    message: 'You do not have enough funds',
                    error: 'Insufficient funds'
                });
            }

            const { isMatch } = await blocApi.verifyNetwork(phone, operatorId);
            if (!isMatch) {
                res.status(409);
                return res.json({
                    success: false,
                    message: 'Phone number and network do not match',
                    error: 'Conflict'
                });
            }

            const response = await blocApi.buyAirtime(amount, operatorId, phone);
            const { operator_name } = response.meta_data;

            await Transaction.create({
                user,
                amount,
                type: 'debit',
                service: 'airtime purchase',
                description: `${operator_name} airtime purchase for ${phone}`,
                reference: await generateReference('ATR'),
                serviceProvider: operator_name,
            });

            res.status(201);
            return res.json({
                success: true,
                message: 'Airtime purchased successfully!',
                amount,
                phone,
                balance: await calcBalance(user),
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async buyData(req: Request, res: Response) {
        try {
            const user = req.user.id;
            const { error } = validators.buyData.validate(req.body, validators.options);
            if (error) {
                res.status(400);
                return res.json({
                    success: false,
                    message: error.message,
                    error: 'Bad request'
                });
            }

            const { operatorId, phone, dataPlanId } = req.body;
            const { amount, operator_name, data_value } = await blocApi.getDataPlanMeta(dataPlanId, operatorId);

            const userBalance = await calcBalance(user);

            if (userBalance < amount) {
                res.status(402);
                return res.json({
                    success: false,
                    message: 'You do not have enough funds',
                    error: 'Insufficient funds'
                });
            }

            const { isMatch } = await blocApi.verifyNetwork(phone, operatorId);
            if (!isMatch) {
                res.status(409);
                return res.json({
                    success: false,
                    message: 'Phone number and network do not match',
                    error: 'Conflict'
                });
            }

            await blocApi.buyData(dataPlanId, amount, operatorId, phone);

            await Transaction.create({
                user,
                amount,
                type: 'debit',
                service: 'data purchase',
                description: `${operator_name} ${data_value} data purchase for ${phone}`,
                reference: await generateReference('IDT'),
                serviceProvider: operator_name,
            });

            res.status(201);
            return res.json({
                success: true,
                message: 'Data purchased successfully!',
                amount,
                phone,
                balance: await calcBalance(user),
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async validateCustomer(req: Request, res: Response) {
        try {
            const { operatorId } = req.params;
            const { bill, deviceNumber } = req.query;
            const { error, result } = await blocApi.validateCustomerDevice(operatorId as string, bill as string, deviceNumber as string);

            if (error) {
                res.status(404);
                return res.json({
                    success: false,
                    message: error.message,
                    error: 'Not found'
                });
            }

            return res.json({
                success: true,
                message: 'Customer details',
                customer: result
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async buyElectricity(req: Request, res: Response) {
        try {
            const { error } = validators.buyElectricity.validate(req.body, validators.options);
            if (error) {
                res.status(400);
                return res.json({
                    success: false,
                    message: error.message,
                    error: 'Bad request'
                });
            }

            const { amount, operatorId, meterType, meterNumber } = req.body;
            if (amount < 500) {
                res.status(400);
                return res.json({
                    success: false,
                    message: 'Minimum amount is 500',
                    error: 'Bad request'
                });
            }

            const amountInKobo = amount * 100;
            const userId = req.user.id;

            const userBalance = await calcBalance(userId);
            if (userBalance < amountInKobo) {
                res.status(402);
                return res.json({
                    success: false,
                    message: 'You do not have enough funds',
                    error: 'Insufficient funds'
                });
            }

            // validate customer device
            const validCustomer = await blocApi.validateCustomerDevice(operatorId, 'electricity', meterNumber, meterType);
            if (validCustomer.error) {
                res.status(404);
                return res.json({
                    success: false,
                    message: validCustomer.error.message,
                    error: 'Not found'
                });
            }

            const response = await blocApi.buyElectricity(amountInKobo, operatorId, meterNumber, meterType);
            const { units, token, operator_name } = response.meta_data;

            await Transaction.create({
                user: userId,
                amount: amountInKobo,
                type: 'debit',
                service: 'bill payment',
                description: `Payment of ${amount} electricity bill | ${meterNumber} ${operator_name} | ${token} | ${units} units.`,
                reference: await generateReference('EPT'),
                serviceProvider: operator_name,
            });

            res.status(201);
            return res.json({
                success: true,
                message: 'Electricity purchased successfully!',
                meterNumber,
                token,
                units,
                balance: await calcBalance(userId),
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }

    async getDiscos(req: Request, res: Response) {
        try {
            const discos = await blocApi.getOperators('electricity');
            return res.json({
                success: true,
                message: 'Electricity distribution companies',
                discos
            });

        } catch (error) {
            errorHandler(error, res);
        }
    }
}

export default new TransactionController();