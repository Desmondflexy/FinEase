import axios, { AxiosInstance } from "axios";

class ApiService {
    private Api: AxiosInstance;
    constructor() {
        let baseURL = "http://localhost:8080/api/v2";
        if (import.meta.env.VITE_NODE_ENV === "production") {
            baseURL = import.meta.env.VITE_SERVER_URL;
        }

        this.Api = axios.create({
            baseURL,
            withCredentials: true,
        });

        this.Api.interceptors.request.use(config => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    login({ emailOrUsername, password }: { emailOrUsername: string, password: string }) {
        return this.Api.post("/auth/login", { emailOrUsername, password })
    }

    getMonthlyExpense() {
        return this.Api.get<{ total: number }>(`transaction/monthly-expense`);
    }
    getRecentTransactions() {
        return this.Api.get(`transaction/recent`);
    }
    getAllUsers(page: number) {
        return this.Api.get(`/admin/all-users?page=${page}`);
    }

    getAccountInfo() {
        return this.Api.get('account');
    }

    fundWallet(response: { reference: string }) {
        return this.Api.post('/transaction/fund-wallet', { reference: response.reference });
    }

    transferWallet(acctNoOrUsername: string, amount: string, password: string) {
        return this.Api.post('transaction/fund-transfer', { acctNoOrUsername, amount: Number(amount), password });
    }

    confirmWalletRecipient(str: string) {
        return this.Api.get(`account/confirm-user?acctNoOrUsername=${str}`)
    }

    verifyEmail(verifyId: string, email: string) {
        return this.Api.patch<{ message: string }>(`/auth/email-verify/${verifyId}?email=${email}`)
    }

    editUserDetails<T>(editData: T) {
        return this.Api.put('account', editData);
    }

    resetPassword({ resetId, email, password, confirm }: { resetId: string | undefined; email: string | null; password: string; confirm: string; }) {
        return this.Api.post(`/auth/reset-password/${resetId}?email=${email}`, { password, confirm })
    }
}

export const apiService = new ApiService();