import { useState } from "react";
import { toast } from "react-toastify";
import { formatNumber, toastError } from "../../utils/helpers";
import { apiService } from "../../api.service";
import { useForm } from "react-hook-form";
import { FineaseRoute } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/hooks";

function TransferWalletModal({ closeModal }: Prop) {
    const [state, setState] = useState<IState>({
        processing: false,
        feedback: '',
    });
    const { user, setUser } = useUser();

    const { processing, feedback } = state;
    const { register, handleSubmit, setValue } = useForm<DataInputs>();
    const navigate = useNavigate();

    function onSubmit(data: DataInputs) {
        setState(s => ({ ...s, processing: true }));
        transferFunds(data);
    }

    function transferFunds(data: DataInputs) {
        const { acctNoOrUsername, amount, password } = data;
        apiService.transferWallet(acctNoOrUsername, amount, password).then(res => {
            setUser({ ...user, balance: res.data.balance });
            setState(s => ({ ...s, balance: formatNumber(res.data.balance), processing: false, feedback: '' }));
            toast.success(res.data.message);
            setValue('acctNoOrUsername', '');
            setValue('amount', '');
            setValue('password', '');
            closeModal();
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, processing: false }));
        });
    }

    function confirmUser(e: React.FocusEvent<HTMLInputElement>) {
        apiService.confirmWalletRecipient(e.target.value).then(res => {
            setState(s => ({ ...s, feedback: res.data.fullName }));
        }).catch(err => {
            if (err.status === 401) {
                navigate(FineaseRoute.LOGIN);
                return;
            }
            setState(s => ({ ...s, feedback: 'Invalid username or account number' }));
        });
    }

    return (
        <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <input {...register("acctNoOrUsername")} id="username" className="form-control" disabled={processing} onBlur={confirmUser} placeholder="Recipient username or account number" required />
                <p className={`text-${feedback.includes('Invalid') ? 'danger' : 'success'} feedback form-text`}>{feedback}</p>
            </div>
            <div className="mb-3">
                <input type="number" className="form-control" disabled={processing} placeholder="Transfer amount" min={1} {...register("amount")} required />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" disabled={processing} placeholder="Enter your login password" {...register("password")} required />
            </div>
            <button className="btn btn-primary w-100" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        </form>
    );
}

type Prop = {
    closeModal: () => void;
}

type DataInputs = {
    acctNoOrUsername: string;
    amount: string;
    password: string;
}

type IState = {
    processing: boolean;
    feedback: string;
}

export default TransferWalletModal;