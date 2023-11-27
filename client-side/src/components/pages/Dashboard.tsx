import { toast } from "react-toastify";
import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

export default function Dashboard() {
  const [user, setUser] = useState({ email: '' });
  const [balance, setBalance] = useState('NGN ------');
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          <OptionsButton onToggle={() => setIsFormOpen(!isFormOpen)} />
        </div>

        <FundWalletModal setBalance={setBalance} onToggle={() => setIsFormOpen(!isFormOpen)} isFormOpen={isFormOpen} email={user.email} />

      </div>
    </Layout>
  )
}

// dropdown button component that shows options to fund wallet, withdraw, transfer
function OptionsButton({ onToggle }: IOptionsButton) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function closeDropdown(e: MouseEvent) {
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

  return (
    <div className="dropdown">
      <CiSettings className="dropdown-btn rotate" onClick={() => setDropdownOpen(!dropdownOpen)} />
      <ul className={`dropdown-content ${dropdownOpen ? '' : 'hidden'}`}>
        <li onClick={onToggle}>Load Wallet</li>
        <li>Withdraw</li>
        <li>Transfer</li>
      </ul>
    </div>
  )
}

function FundWalletModal({ onToggle, isFormOpen, email, setBalance }: IFundWalletModal) {
  const [fundAmount, setFundAmount] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    payWithPaystack(email, Number(fundAmount) * 100, handleTransactionCallback);
    setFundAmount('');
    onToggle();
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
    <OverLay isFormOpen={isFormOpen}>
      <form className="fund-wallet" onSubmit={handleSubmit}>
        <h2>Load Wallet</h2>
        <input placeholder="amount" autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} required />
        <button>Proceed</button>
        <IoMdClose className="close-btn" onClick={onToggle} />
      </form>
    </OverLay>
  )
}

function OverLay({ children, isFormOpen }: IOverLay) {
  return (
    <div className={`overlay ${isFormOpen ? '' : 'hidden'}`}>
      {children}
    </div>
  )
}



// PaystackPop is a global object from paystack.js
declare const PaystackPop: {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    onClose: () => void;
    callback: (response: { reference: string }) => void;
    ref?: string;
  }) => {
    openIframe: () => void;
  };
};

/** Formats num from kobo to naira. */
function formatNumber(num: number) {
  num /= 100;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);

  return formattedNumber;
}

/**Show paystack payment window */
function payWithPaystack(email: string, amount: number, callback: (response: { reference: string }) => void) {
  const handler = PaystackPop.setup({
    key: import.meta.env.VITE_APP_PAYSTACK_PUBLIC,
    email,
    amount,
    onClose: () => console.log('window closed!'),
    callback
  });
  handler.openIframe();
}

interface IFundWalletModal {
  onToggle: () => void;
  isFormOpen: boolean;
  email: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
}

interface IOptionsButton {
  onToggle: () => void
}

interface IOverLay {
  isFormOpen: boolean;
  children: React.ReactNode;
}