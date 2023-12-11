import express from 'express';
import { authenticate, adminPass } from '../controllers/middleware/auth';
import * as user from '../controllers/users'
const router = express.Router();

router.get('/', authenticate, user.accountInfo);
router.get('/me', authenticate, user.me);
router.get('/all-users', authenticate, adminPass, user.allUsers);
router.get("/balance", authenticate, user.getBalance);
router.get('/confirm-user', authenticate, user.getUserFullName);
router.put('/', authenticate, user.updateUser);

export default router;
