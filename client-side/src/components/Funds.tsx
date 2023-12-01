import { useState } from "react";
import { formatNumber, payWithPaystack } from "../utils";
import Api from "../api.config";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export function FundWalletModal({ closeModal, isOpen, email, setBalance }: IFwModal) {
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  function handleCloseModal() {
    closeModal();
    setFundAmount('');
    setProcessing(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      try {
        payWithPaystack(email, Number(fundAmount) * 100, handleTransactionCallback);
        handleCloseModal();
      } catch {
        toast.error('Paystack could not initiate')
      }
      setProcessing(false);
    }, 2000);

  }

  function handleTransactionCallback(response: { reference: string }) {
    const { reference } = response;
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    Api.post('/transaction/fund-wallet', { reference }, { headers })
      .then(res => {
        setBalance(formatNumber(res.data.balance));
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
        <input disabled={processing} placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} required />
        <button disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={handleCloseModal} />
      </form>
    </OverLay>
  )
}

export function TransferWalletModal({ closeModal, isOpen, setBalance }: ITwModal) {
  const [acctNoOrUsername, setAcctNoOrUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleCloseModal() {
    closeModal();
    setAcctNoOrUsername('');
    setAmount('');
    setFeedback('');
    setProcessing(false);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => transferFunds(), 1500);
  }

  function transferFunds() {
    Api.post('transaction/fund-transfer', { acctNoOrUsername, amount })
      .then(res => {
        setBalance(formatNumber(res.data.balance));
        toast.success(res.data.message);
        setAcctNoOrUsername('');
        setAmount('');
        setFeedback('');
        setProcessing(false);
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setProcessing(false);
      });
  }

  function confirmUser(e: React.FocusEvent<HTMLInputElement>) {
    Api.get(`account/confirm-user?acctNoOrUsername=${e.target.value}`)
      .then(res => {
        setFeedback(res.data);
      })
      .catch(() => {
        setFeedback('Invalid username or account number');
      });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'acctNoOrUsername':
        setAcctNoOrUsername(value);
        break;
      case 'amount':
        setAmount(value);
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
        <p className={`${feedback.includes('Invalid') ? 'bad' : 'good'} feedback`}>{feedback}</p>
        <button disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={handleCloseModal} />
      </form>
    </OverLay>
  )
}

export function OverLay({ children, isActive }: IOverLay) {
  const navigate = useNavigate();
  Api.get('account/me').then(() => { }).catch(() => navigate('/login'))
  if (isActive)
    return (
      <div className={`overlay`}>
        {children}
      </div>
    )
}


interface IFwModal extends IModal {
  email: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
}

interface ITwModal extends IModal {
  setBalance: React.Dispatch<React.SetStateAction<string>>;
}

interface IOverLay {
  isActive: boolean;
  children: React.ReactNode;
}

interface IModal {
  closeModal: () => void;
  isOpen: boolean;
}