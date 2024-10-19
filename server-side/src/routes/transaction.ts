import { Router } from "express";
import { authenticate } from "../middleware/auth";
import transactionsController from "../controllers/transactions.controller";

const router = Router();

// /transaction
router.use(authenticate)
router.post("/fund-wallet", transactionsController.fundWallet);
router.post("/fund-transfer", transactionsController.transferFunds);
router.get("/", transactionsController.getTransactions);
router.get('/networks', transactionsController.getNetworks);
router.post('/airtime', transactionsController.buyAirtime);
router.get('/phone-network', transactionsController.getPhoneNetwork);
router.get('/data-plans', transactionsController.getDataPlans);
router.post('/buy-data', transactionsController.buyData);
router.get('/discos', transactionsController.getDiscos);
router.get('/customer-validate/:operatorId', transactionsController.validateCustomer);
router.post('/electricity', transactionsController.buyElectricity);
router.post('/initialize-payment', transactionsController.initializePayment);

export default router;