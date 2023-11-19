import express from 'express';
import * as user from '../controllers/users'
const router = express.Router();

router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/logout', user.logout);

export default router;