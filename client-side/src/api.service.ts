import axios, { AxiosInstance } from "axios";

class ApiService {
    private readonly Api: AxiosInstance;
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

    login(emailOrUsername: string, password: string) {
        return this.Api.post<{ token: string }>("auth/login", { emailOrUsername, password })
    }

    getMonthlyExpense() {
        return this.Api.get<{ total: number }>(`transaction/monthly-expense`);
    }

    getRecentTransactions() {
        return this.Api.get<{ transactions: ITransaction[] }>(`transaction/recent`);
    }
    getAllUsers(page: number, limit: number, search: string = '') {
        return this.Api.get<UsersResponse>(`admin/users?page=${page}&search=${search}&limit=${limit}`);
    }

    getAccountInfo() {
        return this.Api.get('account');
    }

    fundWallet(response: { reference: string }) {
        return this.Api.post('transaction/fund-wallet', { reference: response.reference });
    }

    transferWallet(acctNoOrUsername: string, amount: string, password: string) {
        return this.Api.post('transaction/fund-transfer', { acctNoOrUsername, amount: Number(amount), password });
    }

    confirmWalletRecipient(str: string) {
        return this.Api.get<{ message: string, user: IUser }>(`account/confirm-user?acctNoOrUsername=${str}`);
    }

    verifyEmail(verifyId: string, email: string) {
        return this.Api.patch<{ message: string }>(`auth/${verifyId}/verify-email?email=${email}`);
    }

    editUserDetails<T>(editData: T) {
        return this.Api.put('account', editData);
    }

    resetPassword(resetId: string, email: string, password: string, confirm: string) {
        return this.Api.post(`auth/${resetId}/reset-password?email=${email}`, { password, confirm });
    }

    fetchTransactions(page: number, limit: number, search: string = '') {
        return this.Api.get<TransactionsResponse>(`transaction?page=${page}&search=${search}&limit=${limit}`);
    }

    fetchAllTransactions(page: number, limit: number, search: string = '') {
        return this.Api.get<TransactionsResponse>(`admin/transactions?page=${page}&search=${search}&limit=${limit}`);
    }

    forgotPassword(email: string) {
        return this.Api.post("auth/forgot-password", { email });
    }

    signup<T>(url: string, data: T) {
        return this.Api.post(url, data);
    }

    getNetworks() {
        return this.Api.get<{ operators: Operator[] }>('transaction/operators?bill=telco');
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
        return this.Api.get(`transaction/${operatorId}/data-plans`);
    }

    getDiscos() {
        return this.Api.get<{ operators: Operator[] }>('transaction/operators?bill=electricity');
    }

    validateMeter(operatorId: string, meterNumber: string) {
        return this.Api.get(`transaction/customer-validate?operatorId=${operatorId}&bill=electricity&deviceNumber=${meterNumber}`)
    }

    validateTvSmartCard(operatorId: string, smartCardNumber: string) {
        return this.Api.get(`transaction/customer-validate?operatorId=${operatorId}&bill=television&deviceNumber=${smartCardNumber}`)
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

    logout() {
        return this.Api.post('auth/logout');
    }

    registerDevice(data: { fullName: string, operatorId: string, address: string }) {
        return this.Api.post('devices/add', data);
    }

    getDevices() {
        return this.Api.get<DevicesResponse>('devices');
    }

    getOperatorTvPlans(operatorId: string) {
        return this.Api.get<{ products: CableTvPlan[] }>(`transaction/${operatorId}/tv-plans`);
    }

    getTvOperators() {
        return this.Api.get<{ operators: Operator[] }>('transaction/operators?bill=television');
    }

    payCableTv(operatorId: string, smartCardNumber: string, productId: string) {
        const data = { operatorId, smartCardNumber, productId };
        return this.Api.post<{ message: string, balance: number }>('transaction/pay-tv', data);
    }

    requestDeviceApproval(data: { fullName: string, operatorId: string, address?: string, phone?: string }) {
        return this.Api.post<{ message: string }>('account/add-device', data);
    }

    getAppInfo() {
        return this.Api.get<{ orm: string }>('settings/app-info');
    }
}

export const apiService = new ApiService();