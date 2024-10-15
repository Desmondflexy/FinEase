import { Request, Response } from 'express';
import handleRequest from '../utils/response';
import userService from '../services/users.service';

class UserController {
    allUsers(req: Request, res: Response) {
        handleRequest(req, res, userService.allUsers);
    }

    signup(req: Request, res: Response) {
        handleRequest(req, res, userService.signup, 'userId');
    }

    login(req: Request, res: Response) {
        handleRequest(req, res, () => userService.login(req, res));
    }

    logout(req: Request, res: Response) {
        handleRequest(req, res, () => userService.logout(req, res));
    }

    isAvailable(req: Request, res: Response) {
        handleRequest(req, res, userService.isAvailable);
    }

    verifyEmail(req: Request, res: Response) {
        handleRequest(req, res, userService.verifyEmail);
    }

    sendPasswordResetLink(req: Request, res: Response) {
        handleRequest(req, res, userService.sendPasswordResetLink);
    }

    resetPassword(req: Request, res: Response) {
        handleRequest(req, res, userService.resetPassword);
    }

    me(req: Request, res: Response) {
        handleRequest(req, res, userService.me, 'user');
    }

    getBalance(req: Request, res: Response) {
        handleRequest(req, res, userService.getBalance, 'balance');
    }

    getUserFullName(req: Request, res: Response) {
        handleRequest(req, res, userService.getUserFullName);
    }

    updateUser(req: Request, res: Response) {
        handleRequest(req, res, userService.updateUser, 'user');
    }

    accountInfo(req: Request, res: Response) {
        handleRequest(req, res, userService.accountInfo, 'user');
    }
}

const userController = new UserController;
export default userController;
