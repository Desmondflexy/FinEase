import { Router } from "express";
import * as transaction from "../controllers/transaction";
import { authenticate } from "../controllers/middleware/auth";

const router = Router();

router.post("/fund-wallet", authenticate, transaction.fundWallet);

export default router;