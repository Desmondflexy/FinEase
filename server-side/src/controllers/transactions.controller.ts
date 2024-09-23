import { Request, Response } from 'express';
import response from '../utils/response';
import transactionsService from '../services/transactions.service';

class TransactionsController {
    async getTransactions(req: Request, res: Response) {
        try {
            const result = await transactionsService.getTransactions(req);
            const { data, statusCode, message } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });
        }
        catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async fundWallet(req: Request, res: Response) {
        try {
            const result = await transactionsService.fundWallet(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async transferFunds(req: Request, res: Response) {
        try {
            const result = await transactionsService.transferFunds(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async getNetworks(req: Request, res: Response) {
        try {
            const result = await transactionsService.getNetworks();
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { networks: data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async buyAirtime(req: Request, res: Response) {
        try {
            const result = await transactionsService.buyAirtime(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    getPhoneNetwork(req: Request, res: Response) {
        try {
            const result = transactionsService.getPhoneNetwork(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async getDataPlans(req: Request, res: Response) {
        try {
            const result = await transactionsService.getDataPlans(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { dataPlans: data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async buyData(req: Request, res: Response) {
        try {
            const result = await transactionsService.buyData(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async validateCustomer(req: Request, res: Response) {
        try {
            const result = await transactionsService.validateCustomer(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { customer: data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async buyElectricity(req: Request, res: Response) {
        try {
            const result = await transactionsService.buyElectricity(req);
            const { statusCode, message, data } = result;
            return response.handleSuccess(statusCode, message, res, { ...data });

        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }

    async getDiscos(req:Request, res:Response) {
        try {
            const result = await transactionsService.getDiscos();
            const {statusCode, message, data} = result;
            return response.handleSuccess(statusCode, message, res, {discos: data});
        } catch (error: any) {
            return response.handleError(error.statusCode, error.message, res);
        }
    }
}

const transactionsController = new TransactionsController;
export default transactionsController;
