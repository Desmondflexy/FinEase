import { useState } from "react";
import Api from "../../api.config";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";


function TransferWallet() {
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
    Api.post('transaction/fund-transfer', { acctNoOrUsername, amount, password })
      .then(res => {
        setUser(u => ({ ...u, balance: res.data.balance }));
        toast.success(res.data.message);
        setState(s => ({
          ...s,
          form: { acctNoOrUsername: '', amount: '', password: '' },
          processing: false,
          feedback: '',
        }));
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, processing: false }));
      });
  }

  function confirmUser(e: React.FocusEvent<HTMLInputElement>) {
    Api.get(`account/confirm-user?acctNoOrUsername=${e.target.value}`)
      .then(res => {
        setState(s => ({ ...s, feedback: res.data }));
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
    <form onSubmit={handleSubmit}>
      <div className="mb-3 mx-3">
        <input id="username" type="text" className="form-control" disabled={processing} onBlur={confirmUser} placeholder="Recipient username or account number" name="acctNoOrUsername" value={acctNoOrUsername} onChange={handleChange} required  />
      </div>
      <div className="mb-3 mx-3">
        <input type="number" className="form-control" disabled={processing} placeholder="Transfer amount" min={1} name="amount" id="amount" value={amount} onChange={handleChange} required />
      </div>
      <div className="mb-3 mx-3">
        <input type="password" className="form-control" disabled={processing} placeholder="Enter your login password" name="password" value={password} onChange={handleChange} required />
      </div>
      <p className={`mx-3 ${feedback.includes('Invalid') ? 'error' : 'success'} feedback`}>{feedback}</p>
      <button className="btn btn-primary w-auto mx-3" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
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

export default TransferWallet;