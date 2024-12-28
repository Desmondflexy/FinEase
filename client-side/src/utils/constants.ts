export const networkLogo: { [key: string]: string } = {
    'mtn': '/images/mtn-logo.png',
    'airtel': '/images/airtel-logo.svg',
    'globacom': '/images/glo-logo.png',
    '9mobile': '/images/9mobile-logo.png'
};

export const phoneNumberRegex = /^(070[1-8]|080[2356789]|081[0-8]|090[1-9]|091[12356])\d{7}$/;

export const APP_ROUTES = {
    ALL_USERS: '/account/admin/users',
    ALL_TRANSACTIONS: '/account/admin/transactions',
}