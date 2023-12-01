import express from 'express';
import * as user from '../controllers/users'
const router = express.Router();

router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.post('/admin-signup', user.signup);
router.get('/check/:field/:value', user.isAvailable);

export default router;