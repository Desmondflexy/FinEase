import { Request } from 'express';
import { Transaction, User } from '../models';
import bcrypt from 'bcryptjs';
import {
    phoneNetworks, TRX_TYPES, TRX_SERVICES, blochq, validator, paystack, appError,
    calcBalance, generateReference, validateRequestData
} from '../utils';

class TransactionsService {
    async getTransactions(req: Request): ServiceResponseType {
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

        return {
            message: `Transaction history for ${req.user.username}`,
            data: {
                transactionCount: transactions.length,
                totalTransactions,
                totalPages: Math.ceil(totalTransactions / limit),
                currentPage: page,
                transactions
            }
        };
    }

    async initializePayment(req: Request): ServiceResponseType {
        const { amount } = validateRequestData(req, validator.initializePayment);
        const userId = req.user.id;
        const user = await User.findById(userId) as IUser;
        const email = user.email;
        return {
            message: 'Payment initialized successfully',
            data: await paystack.initialize(amount * 100, email)
        };
    }

    async fundWallet(req: Request): ServiceResponseType {
        const user = req.user.id;
        const { reference } = validateRequestData(req, validator.fundWallet);

        const processed = await Transaction.findOne({ reference });
        if (processed) {
            throw appError(409, 'This transaction has already been processed');
        }
        const amount = await paystack.verify(reference);

        await Transaction.create({
            user,
            amount,
            type: TRX_TYPES.credit,
            service: TRX_SERVICES.funding,
            description: 'Funding via Paystack',
            reference,
            serviceProvider: 'Paystack',
        });

        return {
            statusCode: 201,
            message: "Wallet funded successfully",
            data: { amount, balance: await calcBalance(user) }
        }
    }

    async transferFunds(req: Request): ServiceResponseType {
        const userId = req.user.id;
        const { acctNoOrUsername, password } = validateRequestData(req, validator.transferFunds);
        const amount = req.body.amount * 100;  // convert to kobo

        const requiredInfo = 'username fullName email phone';
        const recipient = await User.findOne({ acctNo: acctNoOrUsername }).select(requiredInfo) || await User.findOne({ username: acctNoOrUsername }).select(requiredInfo);

        // check if recipient exists
        if (!recipient) throw appError(404, 'Recipient not found');

        // check if sender has sufficient balance
        const userBalance = await calcBalance(userId);
        if (userBalance < amount)
            throw appError(422, 'You do not have enough funds to complete this transaction');

        if (recipient.id === userId)
            throw appError(409, 'Cannot transfer funds to self');

        // authenticate transaction
        const user = await User.findById(userId) as IUser;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw appError(401, 'Incorrect password');

        // create debit transaction for sender
        const transaction = await Transaction.create({
            user: userId,
            amount,
            type: TRX_TYPES.debit,
            service: TRX_SERVICES.walletTransfer,
            description: `Wallet transfer to ${recipient.username}`,
            reference: await generateReference('WTR'),
            serviceProvider: 'Wallet2Wallet',
            recipient: recipient._id,
        });

        // create credit transaction for recipient
        await Transaction.create({
            user: recipient._id,
            amount,
            type: TRX_TYPES.credit,
            service: TRX_SERVICES.walletTransfer,
            description: `Wallet transfer from ${req.user.username}`,
            reference: await generateReference('RW'),
            serviceProvider: 'Wallet2Wallet',
            sender: userId,
        });

        return {
            message: `Funds sent to ${recipient.username} successfully!`,
            data: {
                balance: await calcBalance(userId),
                amount: amount / 100,
                reference: transaction.reference,
            }
        }
    }

    async getNetworks(): ServiceResponseType {
        const networks = await blochq.getOperators('telco');
        return {
            message: 'Telecom operators',
            data: { networks }
        }
    }

    async buyAirtime(req: Request): ServiceResponseType {
        const user = req.user.id;

        const { operatorId, phone } = validateRequestData(req, validator.rechargeAirtime);
        const amount = req.body.amount * 100;

        const userBalance = await calcBalance(user);
        if (userBalance < amount)
            throw appError(422, "You do not have enough funds to complete this transaction");

        const { isMatch } = await blochq.verifyNetwork(phone, operatorId);
        if (!isMatch)
            throw appError(409, 'Phone number and network do not match');

        const response = await blochq.buyAirtime(amount, operatorId, phone);
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

        return {
            statusCode: 201,
            message: 'Airtime purchased successfully!',
            data: {
                amount,
                phone,
                balance: await calcBalance(user),
            }
        }
    }

    async getPhoneNetwork(req: Request): ServiceResponseType {
        const phone = req.query.phone as string;
        if (!phone) throw appError(400, 'phone is required in query params');
        const network = phoneNetworks[phone.slice(0, 4)];

        if (!network)
            throw appError(400, `Cannot determine network for ${phone}`)

        return {
            message: 'Phone network',
            data: { network, phone }
        }
    }

    async getDataPlans(req: Request): ServiceResponseType {
        const { operatorId } = validateRequestData(req, validator.getDataPlans, 'query');
        const dataPlans = await blochq.getDataPlans(operatorId);
        return {
            message: 'Data plans',
            data: { dataPlans }
        }
    }

    async buyData(req: Request): ServiceResponseType {
        const user = req.user.id;
        const { operatorId, phone, dataPlanId } = validateRequestData(req, validator.buyData);
        const { amount, operator_name, data_value } = await blochq.getDataPlanMeta(dataPlanId, operatorId);

        const userBalance = await calcBalance(user);

        if (userBalance < amount)
            throw appError(422, "You do not have enough funds to complete this transaction");

        const { isMatch } = await blochq.verifyNetwork(phone, operatorId);
        if (!isMatch)
            throw appError(409, 'Phone number and network do not match');

        await blochq.buyData(dataPlanId, amount, operatorId, phone);

        await Transaction.create({
            user,
            amount,
            type: 'debit',
            service: 'data purchase',
            description: `${operator_name} ${data_value} data purchase for ${phone}`,
            reference: await generateReference('IDT'),
            serviceProvider: operator_name,
        });

        return {
            statusCode: 201,
            message: 'Data purchased successfully!',
            data: {
                amount,
                phone,
                balance: await calcBalance(user),
            }
        }
    }

    async validateCustomer(req: Request): ServiceResponseType {
        const { operatorId, deviceNumber, bill } = validateRequestData(req, validator.validateCustomer, 'query');
        const { error, result } = await blochq.validateCustomerDevice(operatorId, bill, deviceNumber);

        if (error) throw appError(404, error.message);

        return {
            message: "Customer details",
            data: { customer: result }
        }
    }

    async getDiscos(): ServiceResponseType {
        const discos = await blochq.getOperators('electricity');
        return {
            message: 'Electricity distribution companies',
            data: { discos }
        };
    }

    async buyElectricity(req: Request): ServiceResponseType {
        const { amount, operatorId, meterType, meterNumber } = validateRequestData(req, validator.buyElectricity);
        if (amount < 500) {
            throw appError(400, 'Minimum amount is 500');
        }

        const amountInKobo = amount * 100;
        const userId = req.user.id;

        const userBalance = await calcBalance(userId);
        if (userBalance < amountInKobo)
            throw appError(422, "You do not have enough funds to complete this transaction");

        // validate customer device
        const validCustomer = await blochq.validateCustomerDevice(operatorId, 'electricity', meterNumber, meterType);
        if (validCustomer.error)
            throw appError(404, validCustomer.error.message)

        const response = await blochq.buyElectricity(amountInKobo, operatorId, meterNumber, meterType);
        const { units, token, operator_name } = response.meta_data;

        await Transaction.create({
            user: userId,
            amount: amountInKobo,
            type: 'debit',
            service: 'bill payment',
            reference: await generateReference('EPT'),
            serviceProvider: operator_name,
            description: `Payment of ${amount} electricity bill | ${meterNumber} ${operator_name} | ${token} | ${units} units.`,
        });

        return {
            statusCode: 201,
            message: "Electricity purchased successfully!",
            data: {
                meterNumber,
                token,
                units,
                balance: await calcBalance(userId)
            }
        }
    }
}

export const transactionService = new TransactionsService();
