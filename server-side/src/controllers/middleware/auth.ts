import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function authenticate(req: Request, res: Response, next: NextFunction){
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if(!token){
      res.status(401);
      return res.json({
        success: false,
        message: 'Please login to continue',
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


declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}