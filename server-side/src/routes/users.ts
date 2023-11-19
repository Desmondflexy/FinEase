import express from 'express';
import { authenticate } from '../controllers/middleware/auth';
import * as user from '../controllers/users'
const router = express.Router();

/* GET users listing. */
router.get('/', authenticate, user.profile);

export default router;
