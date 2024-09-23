import { Response } from 'express';

/** Class for handling success and error responses.*/
class Responses {
    handleSuccess(statusCode: number, message: string, res: Response, data: object = {}) {
        const success = true;
        return res.status(statusCode).json({ success, message, ...data });
    }

    handleError(statusCode: number, message: string, res: Response) {
        const success = false;
        return res.status(statusCode).json({ success, message });
    }
}

const response = new Responses();
export default response;
