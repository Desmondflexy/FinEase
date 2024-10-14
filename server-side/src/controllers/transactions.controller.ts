import { Request, Response } from 'express';
import handleRequest from '../utils/response';
import transactionsService from '../services/transactions.service';

class TransactionsController {
    async getTransactions(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.getTransactions);
    }

    fundWallet(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.fundWallet);
    }

    transferFunds(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.transferFunds);
    }

    getNetworks(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.getNetworks, 'networks');
    }

    buyAirtime(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.buyAirtime);
    }

    getPhoneNetwork(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.getPhoneNetwork);
    }

    getDataPlans(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.getDataPlans, 'dataPlans');
    }

    buyData(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.buyData);
    }

    validateCustomer(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.validateCustomer);
    }

    buyElectricity(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.buyElectricity,);
    }

    getDiscos(req: Request, res: Response) {
        handleRequest(req, res, transactionsService.getDiscos, 'discos');
    }
}

const transactionsController = new TransactionsController;
export default transactionsController;
