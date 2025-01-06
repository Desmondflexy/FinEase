import { useState } from "react";
import { payWithPaystack, toastError } from "../../utils/helpers";
import { toast } from "react-toastify";
import { apiService } from "../../api.service";
import { useForm } from "react-hook-form";
import { useUser } from "../../utils/hooks";
import { FineaseRoute } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export function FundWalletModal({ closeModal }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, setUser } = useUser();
    const { register, handleSubmit, setValue } = useForm<DataInputs>();
    const navigate = useNavigate();

    const buttonText = isSubmitting ? 'Processing...' : 'Proceed';

    function onSubmit(data: DataInputs) {
        setIsSubmitting(true);
        try {
            payWithPaystack(user.email, +data.fundAmount * 100, fundWalletApi);
        } catch {
            toast.error('Paystack could not initiate')
        }
    }

    function fundWalletApi(response: { reference: string }) {
        apiService.fundWallet(response).then(res => {
            setUser({ ...user, balance: res.data.balance });
            closeModal();
            toast.success('Wallet funded successfully!');
            setValue('fundAmount', '');
        }).catch(err => {
            if (err.status === 401) {
                navigate(FineaseRoute.LOGIN);
                return;
            }
            toastError(err, toast);
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    return (
        <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <input className="form-control" disabled={isSubmitting} placeholder="amount" autoComplete="off" type="number" min={100} id="amount" {...register("fundAmount")} required />
            </div>
            <button className="btn btn-primary w-100" disabled={isSubmitting}>{buttonText}</button>
        </form>
    )
}

type Props = {
    closeModal: () => void;
}

type DataInputs = {
    fundAmount: string;
}