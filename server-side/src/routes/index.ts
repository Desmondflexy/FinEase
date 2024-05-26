import express, { Request, Response } from 'express';
import auth from './auth';
import users from './users';
import transaction from './transaction';

const router = express.Router();

class Router {
    index = router.get('/', async function (req: Request, res: Response) {
        return res.render('index', {
            title: 'FinEase API'
        });
    });

    auth = auth;
    users = users;
    transaction = transaction;
}

export default new Router();