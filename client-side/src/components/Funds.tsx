import { useState } from "react";
import { payWithPaystack } from "../utils/utils";
import Api from "../api.config";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../types";

export function FundWalletModal({ closeModal, isOpen }: IModal) {
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

  function handleCloseModal() {
    closeModal();
    setState(s => ({ ...s, fundAmount: '', processing: false }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    try {
      payWithPaystack(user.email, Number(fundAmount) * 100, fundWalletApi);
      handleCloseModal();
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
    <OverLay isActive={isOpen}>
      <form className="fund-wallet" onSubmit={handleSubmit}>
        <h2>Load Wallet</h2>
        <input disabled={processing} placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={handleChange} required />
        <button className="form-submit" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={handleCloseModal} />
      </form>
    </OverLay>
  )
}

export function TransferWalletModal({ closeModal, isOpen }: IModal) {
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

  function handleCloseModal() {
    closeModal();
    setState(s => ({
      ...s,
      form: {
        acctNoOrUsername: '',
        amount: '',
        password: '',
      },
      processing: false,
      feedback: '',
    }));
  }

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
        closeModal();
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
    <OverLay isActive={isOpen}>
      <form className="fund-wallet" onSubmit={handleSubmit}>
        <h2>Wallet to Wallet Transfer</h2>
        <input disabled={processing} onBlur={confirmUser} placeholder="Recipient username or account number" name="acctNoOrUsername" value={acctNoOrUsername} onChange={handleChange} required />
        <input disabled={processing} placeholder="Transfer amount" type="number" min={1} name="amount" id="amount" value={amount} onChange={handleChange} required />
        <input placeholder="Enter your login password" type="password" name="password" disabled={processing} value={password} onChange={handleChange} required />
        <p className={`${feedback.includes('Invalid') ? 'error' : 'success'} feedback`}>{feedback}</p>
        <button className="form-submit" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={handleCloseModal} />
      </form>
    </OverLay>
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

export function OverLay({ children, isActive }: IOverLay) {
  if (isActive)
    return (
      <div className={`overlay`}>
        {children}
      </div>
    );
}

interface IOverLay {
  isActive: boolean;
  children: React.ReactNode;
}

interface IModal {
  closeModal: () => void;
  isOpen: boolean;
}