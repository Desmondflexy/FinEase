import express, { Request, Response, Router } from 'express';
import authRouter from "./auth";
import usersRouter from "./users";
import transactionRouter from "./transaction";

const router = express.Router();

type RoutesListType = {
    path: string;
    route: Router;
}[];

const defaultRoutes: RoutesListType = [
    { path: "/auth", route: authRouter },
    { path: "/account", route: usersRouter },
    { path: "/transaction", route: transactionRouter },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


export const homeRouter = express.Router();
homeRouter.get('/', async function (req: Request, res: Response) {
    return res.render('index', {
        title: 'FinEase API'
    });
});

export default router;
