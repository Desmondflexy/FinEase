import { Response } from 'express';
import jwt from 'jsonwebtoken';

export function signToken(user: IUser) {
    const secretKey = process.env.JWT_SECRET as string;
    const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 3600;

    const jwtPayload = {
        id: user._id,
        isAdmin: user.isAdmin,
        username: user.username
    };

    const token = jwt.sign(jwtPayload, secretKey, { expiresIn });
    return token;
}

export function verifyToken(token: string) {
    const secretKey = process.env.JWT_SECRET as string;
    return jwt.verify(token, secretKey);
}

export function attachToken(res: Response, token: string) {
    const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 3600;
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie("token", token, { maxAge: expiresIn * 1000, httpOnly: true });
}

/** Remove the token from the authorization headers and cookies */
export function removeToken(res: Response) {
    res.setHeader("Authorization", "");
    res.clearCookie("token");
}
