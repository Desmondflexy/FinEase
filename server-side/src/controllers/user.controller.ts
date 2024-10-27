import { Request, Response } from 'express';
import { handleRequest } from '../utils';
import { userService } from '../services';

class UserController {
    allUsers(req: Request, res: Response) {
        handleRequest(req, res, userService.allUsers);
    }

    signup(req: Request, res: Response) {
        handleRequest(req, res, userService.signup);
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
        handleRequest(req, res, userService.me);
    }

    getBalance(req: Request, res: Response) {
        handleRequest(req, res, userService.getBalance);
    }

    getUserFullName(req: Request, res: Response) {
        handleRequest(req, res, userService.getUserFullName);
    }

    updateUser(req: Request, res: Response) {
        handleRequest(req, res, userService.updateUser);
    }

    accountInfo(req: Request, res: Response) {
        handleRequest(req, res, userService.accountInfo);
    }
}

export const userController = new UserController;
