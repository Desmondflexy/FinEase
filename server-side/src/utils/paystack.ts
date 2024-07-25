import axios from "axios";

// export async function verifyTransaction(ref: string) {
//     const authorizationHeaders = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
//     const url = `https://api.paystack.co/transaction/verify/${ref}`;
//     try {
//         const response = await axios.get(url, authorizationHeaders);
//         return response.data;
//     }
//     catch {
//         throw new Error("Error verifying transaction");
//     }
// }

class Paystack {
    private authorizationHeaders = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
    private baseUrl = "https://api.paystack.co";

    async verifyTransaction(ref: string) {
        const url = `${this.baseUrl}/transaction/verify/${ref}`;
        try {
            const response = await axios.get(url, this.authorizationHeaders);
            return response.data;
        }
        catch {
            throw new Error("Error verifying transaction");
        }
    }

    async initiateTransfer(data: { amount: number, recipient: string, source: string }) {
        const url = `${this.baseUrl}/transfer`;
        try {
            const response = await axios.post(url, data, this.authorizationHeaders);
            return response.data;
        }
        catch {
            throw new Error("Error initiating transfer");
        }
    }

    async finalizeTransfer(ref: string, otp: string) {
        const url = `${this.baseUrl}/transfer/finalize_transfer/${ref}`;
        try {
            const response = await axios.post(url, { otp }, this.authorizationHeaders);
            return response.data;
        }
        catch {
            throw new Error("Error finalizing transfer");
        }
    }
}

export default new Paystack();