import express from 'express';
import { userController } from '../controllers';

export const authRouter = express.Router();
authRouter.post('/signup', userController.signup);
authRouter.post('/login', userController.login);
authRouter.post('/logout', userController.logout);
authRouter.post('/admin-signup', userController.signup);
authRouter.get('/check/:field/:value', userController.isAvailable);
authRouter.post('/email-verify/:verifyId', userController.verifyEmail);
authRouter.post('/forgot-password', userController.sendPasswordResetLink);
authRouter.post('/reset-password/:resetId', userController.resetPassword);
