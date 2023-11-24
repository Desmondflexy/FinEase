import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction){
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if(!token){
      res.status(401);
      return res.json({
        success: false,
        message: 'Please login',
        error: 'No token provided'
      });
    }

    const secretKey = process.env.JWT_SECRET as string;

    const decodedPayload = jwt.verify(token, secretKey);
    req.user = decodedPayload;
    next();
  }

  catch(error: any){
    res.status(401);
    return res.json({
      success: false,
      message: 'Unauthorized',
      error: error.message
    });
  }
}

export function authorize(req: Request, res: Response, next: NextFunction){
  try {
    if(!req.user){
      res.status(401);
      return res.json({
        success: false,
        message: 'Unauthorized',
        error: 'Please login'
      });
    }

    const { isAdmin } = req.user;
    if(!isAdmin){
      res.status(403);
      return res.json({
        success: false,
        message: 'Forbidden',
        error: 'You are not authorized to perform this action'
      });
    }

    next();
  }

  catch(error: any){
    res.status(401);
    return res.json({
      success: false,
      message: 'Unauthorized',
      error: error.message
    });
  }

}


declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}