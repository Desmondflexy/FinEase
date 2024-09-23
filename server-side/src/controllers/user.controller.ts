import { Request, Response } from 'express';
import response from '../utils/response';
import userService from '../services/users.service';
import { attachToken } from '../utils/jwt';

class UserController {
    async allUsers(req: Request, res: Response) {
        try {
            const result = await userService.allUsers(req);
            const { users, totalUsers, totalPages, currentPage } = result;
            return response.handleSuccess(result.statusCode, result.message, res, { totalUsers, totalPages, currentPage, users });
        }
        catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async signup(req: Request, res: Response) {
        try {
            const result = await userService.signup(req);
            return response.handleSuccess(result.statusCode, result.message, res, { userId: result.userId });
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await userService.login(req);
            attachToken(res, result.token);
            return response.handleSuccess(result.statusCode, result.message, res, { token: result.token });
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const result = await userService.logout(req);
            res.clearCookie('token');
            return response.handleSuccess(result.statusCode, result.message, res);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async isAvailable(req: Request, res: Response) {
        try {
            const result = await userService.isAvailable(req);
            return response.handleSuccess(result.statusCode, result.message, res);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const result = await userService.verifyEmail(req);
            return response.handleSuccess(result.statusCode, result.message, res);

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async sendPasswordResetLink(req: Request, res: Response) {
        try {
            const result = await userService.sendPasswordResetLink(req);
            return response.handleSuccess(result.statusCode, result.message, res)
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const result = await userService.resetPassword(req);
            return response.handleSuccess(result.statusCode, result.message, res);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async me(req: Request, res: Response) {
        try {
            const result = await userService.me(req);
            return response.handleSuccess(result.statusCode, result.message, res, result.data);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async getBalance(req: Request, res: Response) {
        try {
            const result = await userService.getBalance(req);
            return response.handleSuccess(result.statusCode, result.message, res, result.data);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async getUserFullName(req: Request, res: Response) {
        try {
            const result = await userService.getUserFullName(req);
            return response.handleSuccess(result.statusCode, result.message, res, result.data);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const result = await userService.updateUser(req);
            return response.handleSuccess(result.statusCode, result.message, res, result.data);
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async accountInfo(req: Request, res: Response) {
        try {
            const result = await userService.accountInfo(req);
            return response.handleSuccess(result.statusCode, result.message, res, { user: result.data });
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }
}

const userController = new UserController;
export default userController;
