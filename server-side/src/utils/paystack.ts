import axios from "axios";
import { appError } from ".";

class Paystack {
    private authorizationHeaders = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
    private baseUrl = "https://api.paystack.co";

    async initialize(amount: number, email: string) {
        const url = `${this.baseUrl}/transaction/initialize`;
        try {
            const response = await axios.post(url, { amount, email }, this.authorizationHeaders);
            return response.data.data;
        } catch (error: any) {
            throw appError(500, "Error initializing transaction");
        }
    }

    async verify(ref: string) {
        const url = `${this.baseUrl}/transaction/verify/${ref}`;
        try {
            const response = await axios.get(url, this.authorizationHeaders);
            const result = response.data.data;
            if (result.status !== 'success') {
                throw new Error(result.gateway_response);
            }
            return result.amount;
        } catch (error: any) {
            throw appError(400, 'Could not verify transaction', error.message);
        }
    }
}

export default new Paystack();