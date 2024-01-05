import { useState } from "react";
import { payWithPaystack } from "../../utils";
import Api from "../../api.config";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";

export function FundWalletModal() {
  interface IState {
    fundAmount: string;
    processing: boolean;
  }
  const [user, setUser] = useOutletContext() as OutletContextType;
  const [state, setState] = useState<IState>({
    fundAmount: '',
    processing: false,
  });

  const { fundAmount, processing } = state;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    try {
      payWithPaystack(user.email, Number(fundAmount) * 100, fundWalletApi);
    } catch {
      toast.error('Paystack could not initiate')
    }
    setState(s => ({ ...s, processing: false }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(s => ({ ...s, fundAmount: e.target.value }));
  }

  function fundWalletApi(response: { reference: string }) {
    Api.post('/transaction/fund-wallet', { reference: response.reference })
      .then(res => {
        setUser(u => ({ ...u, balance: res.data.balance }));
        toast.success('Wallet funded successfully!');
      })
      .catch(err => {
        console.error(err.response.data);
      });
  }

  return (
    <form className="fund-wallet" onSubmit={handleSubmit}>
      <h2>Load Wallet</h2>
      <input disabled={processing} placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={handleChange} required />
      <button className="form-submit" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
    </form>
  )
}