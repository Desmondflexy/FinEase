import express from 'express';
import userController from '../controllers/user.controller';
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/admin-signup', userController.signup);
router.get('/check/:field/:value', userController.isAvailable);
router.post('/email-verify/:verifyId', userController.verifyEmail);
router.post('/forgot-password', userController.sendPasswordResetLink);
router.post('/reset-password/:resetId', userController.resetPassword);

export default router;