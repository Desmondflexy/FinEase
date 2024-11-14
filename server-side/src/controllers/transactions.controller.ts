import { Request, Response } from 'express';
import { handleRequest } from '../utils/response';
import { transactionService } from '../services';

class TransactionsController {
    async getTransactions(req: Request, res: Response) {
        handleRequest(req, res, transactionService.getTransactions);
    }

    fundWallet(req: Request, res: Response) {
        handleRequest(req, res, transactionService.fundWallet);
    }

    transferFunds(req: Request, res: Response) {
        handleRequest(req, res, transactionService.transferFunds);
    }

    getNetworks(req: Request, res: Response) {
        handleRequest(req, res, transactionService.getNetworks);
    }

    buyAirtime(req: Request, res: Response) {
        handleRequest(req, res, transactionService.buyAirtime);
    }

    getPhoneNetwork(req: Request, res: Response) {
        handleRequest(req, res, transactionService.getPhoneNetwork);
    }

    getDataPlans(req: Request, res: Response) {
        handleRequest(req, res, transactionService.getDataPlans);
    }

    buyData(req: Request, res: Response) {
        handleRequest(req, res, transactionService.buyData);
    }

    validateCustomer(req: Request, res: Response) {
        handleRequest(req, res, transactionService.validateCustomer);
    }

    buyElectricity(req: Request, res: Response) {
        handleRequest(req, res, transactionService.buyElectricity,);
    }

    getDiscos(req: Request, res: Response) {
        handleRequest(req, res, transactionService.getDiscos);
    }

    initializePayment(req: Request, res: Response) {
        handleRequest(req, res, transactionService.initializePayment);
    }
}

export const transactionController = new TransactionsController;
