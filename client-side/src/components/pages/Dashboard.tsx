import { toast } from "react-toastify";
import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { formatNumber, payWithPaystack } from "../../utils";

export default function Dashboard() {
  const [user, setUser] = useState({ email: '' });
  const [balance, setBalance] = useState('NGN ------');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fwOpen, setFwOpen] = useState(false); // fund wallet modal not open
  const [twOpen, setTwOpen] = useState(false); // transfer wallet modal not open

  const openModal = (setModalOpen: (isOpen: boolean) => void) => setModalOpen(true)
  const closeDropdown = (e: MouseEvent) => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn && !dropdownBtn.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  useEffect(() => {
    Api.get('/account')
      .then(res => {
        const { email } = res.data.user;
        setUser(u => ({ ...u, email }));
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })
  }, []);

  useEffect(() => {
    Api.get('/account/balance')
      .then(res => {
        setBalance(formatNumber(res.data.balance));
      })
      .catch(err => toast.error(err.response.data.message))
  }, []);

  return (
    <Layout>
      <div id="dashboard">
        <h1>Dashboard</h1>
        <div>
          <p>Email: {user.email}</p>
        </div>
        <div className="card balance">
          <h2>{balance}</h2>
          <p>Current Wallet Balance</p>
          <div className="dropdown">
            <CiSettings className="dropdown-btn rotate" onClick={() => setDropdownOpen(!dropdownOpen)} />
            <ul className={`dropdown-content ${dropdownOpen ? '' : 'hidden'}`}>
              <li onClick={() => openModal(setFwOpen)}>Load Wallet</li>
              <li onClick={() => openModal(setTwOpen)}>Transfer</li>
            </ul>
          </div>
        </div>

        <FundWalletModal setBalance={setBalance} closeModal={() => setFwOpen(false)} isOpen={fwOpen} email={user.email} />
        <TransferWalletModal closeModal={() => setTwOpen(false)} isOpen={twOpen} setBalance={setBalance} />
      </div>
    </Layout>
  )
}

function FundWalletModal({ closeModal, isOpen, email, setBalance }: IFwModal) {
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    payWithPaystack(email, Number(fundAmount) * 100, handleTransactionCallback);
    setFundAmount('');
    setProcessing(false);
    closeModal();
  }

  function handleTransactionCallback(response: { reference: string }) {
    const { reference } = response;
    Api.post('/transaction/fund-wallet', { reference })
      .then(res => {
        setBalance(formatNumber(res.data.balance));
        toast.success('Wallet funded successfully!');
      })
      .catch(err => {
        console.log(err.response.data);
      });
  }

  return (
    <OverLay isActive={isOpen}>
      <form className="fund-wallet" onSubmit={handleSubmit}>
        <h2>Load Wallet</h2>
        <input placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} required />
        <button disabled={processing}>{processing? 'Processing':'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={closeModal} />
      </form>
    </OverLay>
  )
}

function TransferWalletModal({ closeModal, isOpen, setBalance }: ITwModal) {
  const [acctNo, setAcctNo] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Api.post('transaction/fund-transfer', {acctNo, amount})
      .then(res => {
        setProcessing(true);
        console.log(res.data);
        setBalance(formatNumber(res.data.balance));
        setTimeout(() => {
          toast.success(res.data.message);
          setProcessing(false)
          closeModal();
        }, 1500)
      })
      .catch(err => {
        toast.error(err.response.data.message);
      })

  }

  return (
    <OverLay isActive={isOpen}>
      <form className="fund-wallet" onSubmit={handleSubmit}>
        <h2>Wallet to Wallet Transfer</h2>
        <input placeholder="Recipient account number" autoComplete="on" name="acctNo" id="acctNo" value={acctNo} onChange={(e) => setAcctNo(e.target.value)} required />
        <input placeholder="Transfer amount" autoComplete="off" type="number" min={1} name="amount" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button disabled={processing}>{processing? 'Processing':'Proceed'}</button>
        <IoMdClose className="close-btn" onClick={closeModal} />
      </form>
    </OverLay>
  )
}

function OverLay({ children, isActive }: IOverLay) {
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

interface ITwModal extends IModal{
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