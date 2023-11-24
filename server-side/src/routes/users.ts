import express from 'express';
import { authenticate, authorize } from '../controllers/middleware/auth';
import * as user from '../controllers/users'
const router = express.Router();

/* GET users listing. */
router.get('/', authenticate, user.profile);
router.get('/me', authenticate, user.me);
router.get('/all-users', authenticate, authorize, user.allUsers);

export default router;
