import express from 'express';
import { authenticate, adminPass } from '../middleware';
import { userController } from '../controllers';

export const usersRouter = express.Router();
usersRouter.use(authenticate)
usersRouter.get('/', userController.accountInfo);
usersRouter.get('/me', userController.me);
usersRouter.get('/all-users', adminPass, userController.allUsers);
usersRouter.get("/balance", userController.getBalance);
usersRouter.get('/confirm-user', userController.getUserFullName);
usersRouter.put('/', userController.updateUser);
