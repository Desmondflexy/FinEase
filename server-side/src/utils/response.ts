import { Response, Request } from 'express';

class ApiResponse {
    private handleSuccess = (res: Response, statusCode: number = 200, message: string, data: object = {}) => {
        const success = true;
        return res.status(statusCode).json({ success, message, ...data });
    }

    // not private because it will be used in other places like the auth middleware
    handleError = (res: Response, statusCode: number = 500, message: string, error: string) => {
        const success = false;
        return res.status(statusCode).json({ success, message, error });
    }

    /**
     * Handle HTTP request and return an HTTP response for the given service method.
     */
    handleRequest = async (req: Request, res: Response, serviceMethod: ServiceMethod) => {
        try {
            const result = await serviceMethod(req);
            const { data, statusCode, message } = result;
            return this.handleSuccess(res, statusCode, message, data);
        } catch (error: any) {
            console.log(error);
            return this.handleError(res, error.statusCode, error.message, error.details);
        }
    }
}

const apiResponse = new ApiResponse();
export const { handleRequest, handleError } = apiResponse;
