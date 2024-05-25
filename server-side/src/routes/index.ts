import express, { Request, Response } from 'express';

const router = express.Router();
router.get('/', async function (req: Request, res: Response) {
    return res.render('index', {
        title: 'FinEase API'
    });
});

export default router;