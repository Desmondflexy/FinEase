import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { formatNumber } from "../../utils";
import { FundWalletModal, TransferWalletModal } from "../Funds";

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

  const fetchAccount = () => {
    Api.get('/account')
      .then(res => {
        const { email } = res.data.user;
        setUser(u => ({ ...u, email }));
      })
      .catch(err => {
        console.error(err.response.data.message)
      });
  }

  const fetchAccountBalance = () => {
    Api.get('/account/balance')
      .then(res => {
        setBalance(formatNumber(res.data.balance));
      })
      .catch(err => {
        console.error(err.response.data.message)
      })
  }

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  useEffect(fetchAccount, []);
  useEffect(fetchAccountBalance, []);

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
