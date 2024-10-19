import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/response';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return handleError(res, 401, 'Please login', 'No token provided');
    }

    const secretKey = process.env.JWT_SECRET as string;
    try {
        const decodedPayload = jwt.verify(token, secretKey);
        req.user = decodedPayload as IPayload;
        next();

    } catch (error: any) {
        console.error(error);
        return handleError(res, 401, 'Please login', error.message);
    }
}

export function adminPass(req: Request, res: Response, next: NextFunction) {
    const { isAdmin } = req.user;
    if (!isAdmin) {
        return handleError(res, 403, 'Forbidden', 'You are not authorized to perform this action');
    }

    next();
}