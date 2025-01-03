export const networkLogo: { [key: string]: string } = {
    'mtn': '/images/mtn-logo.png',
    'airtel': '/images/airtel-logo.svg',
    'globacom': '/images/glo-logo.png',
    '9mobile': '/images/9mobile-logo.png'
};

export const phoneNumberRegex = /^(070[1-8]|080[2356789]|081[0-8]|090[1-9]|091[12356])\d{7}$/;

export enum FineaseRoute {
    HOME = '/',
    LOGIN = '/auth/login',
    SIGNUP = '/auth/signup',
    ADMIN_SIGNUP = '/auth/admin-signup',
    FORGOT_PASSWORD = '/auth/forgot-password',
    LOGOUT = '/auth/logout',
    DASHBOARD = '/account/dashboard',
    RECHARGE = '/account/recharge',
    TRANSACTIONS = '/account/transactions',
    PROFILE = '/account/profile',
    SETTINGS = '/account/settings',
    ADMIN_AREA = '/account/admin',
    ALL_USERS = '/account/admin/users',
    ALL_TRANSACTIONS = '/account/admin/transactions',
    DEVICES = '/account/admin/devices',
    ADD_DEVICE = '/account/admin/add-device',
    APPROVALS = '/account/admin/approvals',
}