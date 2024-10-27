import express from "express";
import { authenticate } from "../middleware";
import { transactionController } from "../controllers";

export const transactionRouter = express.Router();
transactionRouter.use(authenticate)
transactionRouter.post("/fund-wallet", transactionController.fundWallet);
transactionRouter.post("/fund-transfer", transactionController.transferFunds);
transactionRouter.get("/", transactionController.getTransactions);
transactionRouter.get('/networks', transactionController.getNetworks);
transactionRouter.post('/airtime', transactionController.buyAirtime);
transactionRouter.get('/phone-network', transactionController.getPhoneNetwork);
transactionRouter.get('/data-plans', transactionController.getDataPlans);
transactionRouter.post('/buy-data', transactionController.buyData);
transactionRouter.get('/discos', transactionController.getDiscos);
transactionRouter.get('/customer-validate/:operatorId', transactionController.validateCustomer);
transactionRouter.post('/electricity', transactionController.buyElectricity);
transactionRouter.post('/initialize-payment', transactionController.initializePayment);
