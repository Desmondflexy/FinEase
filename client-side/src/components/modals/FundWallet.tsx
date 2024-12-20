import { useState } from "react";
import { payWithPaystack } from "../../utils/utils";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";
import { apiService } from "../../api.service";

interface Props {
    closeModal: (id: string) => void;
}

export function FundWalletModal({ closeModal }: Props) {
    interface IState {
        fundAmount: string;
        processing: boolean;
    }
    const [user, setUser] = useOutletContext() as OutletContextType;
    const [state, setState] = useState<IState>({
        fundAmount: '',
        processing: false,
    });

    const { processing, fundAmount } = state;

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState(s => ({ ...s, processing: true }));
        try {
            payWithPaystack(user.email, Number(fundAmount) * 100, fundWalletApi);
        } catch {
            toast.error('Paystack could not initiate')
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setState(s => ({ ...s, fundAmount: e.target.value }));
    }

    function fundWalletApi(response: { reference: string }) {
        apiService.fundWallet(response)
            .then(res => {
                setUser(u => ({ ...u, balance: res.data.balance }));
                closeModal('fundWallet');
                toast.success('Wallet funded successfully!');
                setState(s => ({ ...s, processing: false, fundAmount: '' }));
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
        <form className="m-3" onSubmit={handleSubmit}>
            <div className="mb-3">
                <input className="form-control" disabled={processing} placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary w-100" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        </form>
    )
}