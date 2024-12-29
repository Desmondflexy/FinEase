import { useState } from "react";
import { payWithPaystack } from "../../utils/helpers";
import { toast } from "react-toastify";
import { apiService } from "../../api.service";
import { useForm } from "react-hook-form";
import { useUserHook } from "../../utils/hooks";

type Props = {
    closeModal: (id: string) => void;
}

type DataInputs = {
    fundAmount: string;
}

type IState = {
    processing: boolean;
}

export function FundWalletModal({ closeModal }: Props) {
    const [state, setState] = useState<IState>({
        processing: false,
    });
    const { setUser, user } = useUserHook();

    const { processing } = state;

    const { register, handleSubmit, setValue } = useForm<DataInputs>();

    function onSubmit(data: DataInputs) {
        setState(s => ({ ...s, processing: true }));
        try {
            payWithPaystack(user.email, +data.fundAmount * 100, fundWalletApi);
        } catch {
            toast.error('Paystack could not initiate')
        }
    }

    function fundWalletApi(response: { reference: string }) {
        apiService.fundWallet(response)
            .then(res => {
                setUser({ ...user, balance: res.data.balance });
                closeModal('fundWallet');
                toast.success('Wallet funded successfully!');
                setState(s => ({ ...s, processing: false }));
                setValue('fundAmount', '');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch(err => {
                console.error(err.response.data);
                setState(s => ({ ...s, processing: false }));
            });
    }

    return (
        <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <input className="form-control" disabled={processing} placeholder="amount" autoComplete="off" type="number" min={100} id="amount" {...register("fundAmount")} required />
            </div>
            <button className="btn btn-primary w-100" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        </form>
    )
}