import { useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";
import { handleError } from "../../utils/utils";
import { apiService } from "../../api.service";

interface Prop {
    closeModal: (id: string) => void;
}

function TransferWalletModal({ closeModal }: Prop) {
    const [state, setState] = useState<IState>({
        form: {
            acctNoOrUsername: '',
            amount: '',
            password: '',
        },
        processing: false,
        feedback: '',
    });

    const { form, processing, feedback } = state;
    const { acctNoOrUsername, amount, password } = form;

    const userContext = useOutletContext() as OutletContextType;
    const setUser = userContext[1];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(s => ({ ...s, processing: true }));
        transferFunds();
    }

    function transferFunds() {
        apiService.transferWallet(acctNoOrUsername, amount, password)
            .then(res => {
                setUser(u => ({ ...u, balance: res.data.balance }));
                toast.success(res.data.message);
                setState(s => ({
                    ...s,
                    form: { acctNoOrUsername: '', amount: '', password: '' },
                    processing: false,
                    feedback: '',
                }));
                closeModal('transferWallet');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch(err => {
                handleError(err, toast);
                setState(s => ({ ...s, processing: false }));
            });
    }

    function confirmUser(e: React.FocusEvent<HTMLInputElement>) {
        apiService.confirmWalletRecipient(e.target.value)
            .then(res => {
                setState(s => ({ ...s, feedback: res.data.fullName }));
            })
            .catch(() => {
                setState(s => ({ ...s, feedback: 'Invalid username or account number' }));
            });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        switch (name) {
            case 'acctNoOrUsername':
                setState(s => ({ ...s, form: { ...s.form, acctNoOrUsername: value } }));
                break;
            case 'amount':
                setState(s => ({ ...s, form: { ...s.form, amount: value } }));
                break;
            case 'password':
                setState(s => ({ ...s, form: { ...s.form, password: value } }));
                break;
            default:
                break;
        }
    }

    return (
        <form className="m-3" onSubmit={handleSubmit}>
            <div className="mb-3">
                <input id="username" type="text" className="form-control" disabled={processing} onBlur={confirmUser} placeholder="Recipient username or account number" name="acctNoOrUsername" value={acctNoOrUsername} onChange={handleChange} required />
                <p className={`text-${feedback.includes('Invalid') ? 'danger' : 'success'} feedback form-text`}>{feedback}</p>
            </div>
            <div className="mb-3">
                <input type="number" className="form-control" disabled={processing} placeholder="Transfer amount" min={1} name="amount" value={amount} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" disabled={processing} placeholder="Enter your login password" name="password" value={password} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary w-100" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        </form>
    );

    interface IState {
        form: {
            acctNoOrUsername: string;
            amount: string;
            password: string;
        }
        processing: boolean;
        feedback: string;
    }
}

export default TransferWalletModal;