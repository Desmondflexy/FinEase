import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { formatDateTime, formatNumber } from "../../utils";
import { FundWalletModal, TransferWalletModal } from "../Funds";
import { useOutletContext } from "react-router-dom";
import { ITransaction, IUser } from "../../types";
import Api from "../../api.config";

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fwOpen, setFwOpen] = useState(false); // fund wallet modal not open
  const [twOpen, setTwOpen] = useState(false); // transfer wallet modal not open
  const [user] = useOutletContext() as [IUser];
  const [balance, setBalance] = useState(formatNumber(user.balance));
  const [recent10, setRecent10] = useState<ITransaction[]>([]);

  const openModal = (setModalOpen: (isOpen: boolean) => void) => setModalOpen(true)
  const closeDropdown = (e: MouseEvent) => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn && !dropdownBtn.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }

  const getRecentTransactions = () => {
    const limit = 10;
    Api.get(`transaction?limit=${limit}`)
      .then(res => {
        setRecent10(res.data.transactions);
      })
      .catch(err => {
        console.error(err.response.data);
      })
  }

  useEffect(getRecentTransactions, [balance]);

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <>
      <section id="dashboard">
        <h1>Dashboard</h1>
        <div>
          <p>Email: {user.email}</p>
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
        </div>

        <div className="table-container">
          <h3>Recent Transactions</h3>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th className="table-desc">Description</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent10.map((trx: ITransaction, index: number) => (
                  <tr key={trx._id}>
                    <td>{index + 1}</td>
                    <td>{trx.type}</td>
                    <td>{formatNumber(+trx.amount).slice(3)}</td>
                    <td>{trx.description}</td>
                    <td>{formatDateTime(trx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FundWalletModal setBalance={setBalance} closeModal={() => setFwOpen(false)} isOpen={fwOpen} email={user.email} />
      <TransferWalletModal closeModal={() => setTwOpen(false)} isOpen={twOpen} setBalance={setBalance} />
    </>
  )
}