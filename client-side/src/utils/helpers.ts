// PaystackPop is a global object from paystack.js
declare const PaystackPop: {
    setup: (options: {
        key: string;
        email: string;
        amount: number;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
        ref?: string;
    }) => {
        openIframe: () => void;
    };
};

/** Formats num from kobo to naira. */
export function formatNumber(num: number) {
    num /= 100;
    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);

    return formattedNumber;
}

/**Show paystack payment window */
export function payWithPaystack(email: string, amount: number, callback: (response: { reference: string }) => void) {
    const handler = PaystackPop.setup({
        key: import.meta.env.VITE_APP_PAYSTACK_PUBLIC,
        email,
        amount,
        onClose: () => console.log('window closed!'),
        callback
    });
    handler.openIframe();
}

export function formatDateTime(date: string) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hour = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hour}:${minutes}`;
}

export function greet() {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 17) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleError(err: any, toast: any) {
    if (err.response) {
        const error = err.response.data.message;
        if (typeof error === "string") {
            toast.error(error);
        } else {
            toast.error(error[0]);
        }
    } else {
        toast.error(err.message);
    }
}
