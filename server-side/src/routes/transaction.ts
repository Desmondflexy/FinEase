import { Router } from "express";
import * as transaction from "../controllers/transaction";
import { authenticate } from "../controllers/middleware/auth";

const router = Router();

router.post("/fund-wallet", authenticate, transaction.fundWallet);
router.post("/fund-transfer", authenticate, transaction.transferFunds);
router.get("/", authenticate, transaction.getTransactions);
router.get('/networks', transaction.getNetworks);
router.post('/airtime', authenticate, transaction.buyAirtime);

export default router;