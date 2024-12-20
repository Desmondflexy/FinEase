import axios, { AxiosInstance } from "axios";

class ApiService {
    private Api: AxiosInstance;
    constructor() {
        let baseURL = "http://localhost:8080/api/v2";
        if (import.meta.env.VITE_NODE_ENV !== "development") {
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
        return this.Api.get(`account/confirm-user?acctNoOrUsername=${str}`);
    }

    verifyEmail(verifyId: string, email: string) {
        return this.Api.patch<{ message: string }>(`/auth/email-verify/${verifyId}?email=${email}`);
    }

    editUserDetails<T>(editData: T) {
        return this.Api.put('account', editData);
    }

    resetPassword({ resetId, email, password, confirm }: { resetId: string | undefined; email: string | null; password: string; confirm: string; }) {
        return this.Api.post(`/auth/reset-password/${resetId}?email=${email}`, { password, confirm });
    }

    fetchTransactions(page: number) {
        return this.Api.get(`/transaction?page=${page}`);
    }

    forgotPassword(email: string) {
        return this.Api.post("/auth/forgot-password", { email });
    }

    signup<T>(url: string, data: T) {
        return this.Api.post(url, data);
    }

    getNetworks() {
        return this.Api.get('transaction/networks');
    }

    buyAirtime(operatorId: string, amount: string, phone: string) {
        return this.Api.post('transaction/airtime', { operatorId, amount: +amount, phone })
    }

    buyData(operatorId: string, dataPlanId: string, phone: string) {
        return this.Api.post('transaction/buy-data', { operatorId, dataPlanId, phone })
    }

    getMobileNetwork(phone: string) {
        return this.Api.get(`transaction/phone-network?phone=${phone}`);
    }

    getOperatorDataPlans(operatorId: string) {
        return this.Api.get(`transaction/data-plans?operatorId=${operatorId}`)
    }

    getDiscos() {
        return this.Api.get('transaction/discos');
    }

    validateMeter(operatorId: string, meterNumber: string) {
        return this.Api.get(`transaction/customer-validate?operatorId=${operatorId}&bill=electricity&deviceNumber=${meterNumber}`)
    }

    buyElectricity(operatorId: string, amount: string, meterNumber: string, meterType: string) {
        return this.Api.post('transaction/electricity', { amount: +amount, operatorId, meterType, meterNumber })
    }

    initializePayment(amount: string) {
        type response = {
            access_code: string;
            reference: string;
            authorization_url: string;
        }
        return this.Api.post<response>('transaction/initialize-payment', { amount: +amount })
    }
}

export const apiService = new ApiService();