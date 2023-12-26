import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { formatDateTime, formatNumber } from "../../utils";
import { FundWalletModal, TransferWalletModal } from "../Funds";
import { useOutletContext } from "react-router-dom";
import { ITransaction, IUser } from "../../types";
import Api from "../../api.config";

export default function Dashboard() {
  interface IState {
    dropdownOpen: boolean;
    fwOpen: boolean;
    twOpen: boolean;
    balance: number;
    recent10: ITransaction[];
  }
  const [user] = useOutletContext() as [IUser];

  const [state, setState] = useState<IState>({
    dropdownOpen: false,
    fwOpen: false,
    twOpen: false,
    balance: 0,
    recent10: []
  });

  const { dropdownOpen, fwOpen, twOpen, balance, recent10 } = state;

  useEffect(getRecentTransactions, [user]);

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  useEffect(() => {
    setState(s => ({ ...s, balance: user.balance }));
  }, [user.balance])

  function openModal(feature: 'fund' | 'transfer') {
    switch (feature) {
      case 'fund':
        console.log('fund wallet open');
        setState(s => ({ ...s, fwOpen: true }));
        break;
      case 'transfer':
        console.log('transfer wallet open');
        setState(s => ({ ...s, twOpen: true }));
        break;
      default:
        break;
    }
  }

  function closeModal() {
    setState(s => ({ ...s, fwOpen: false, twOpen: false }));
  }

  function closeDropdown(e: MouseEvent) {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn && !dropdownBtn.contains(e.target as Node)) {
      setState(s => ({ ...s, dropdownOpen: false }));
    }
  }

  function toggleDropdown() {
    setState(s => ({ ...s, dropdownOpen: !dropdownOpen }));
  }

  function getRecentTransactions() {
    Api.get(`transaction?limit=${10}`)
      .then(res => {
        setState(s => ({ ...s, recent10: res.data.transactions }));
      })
      .catch(err => {
        console.error(err.response.data);
      })
  }

  return (
    <>
      <section id="dashboard">
        <h1>Dashboard</h1>
        <div>
          <p>Email: {user.email}</p>
          <div className="card balance">
            <h2>{formatNumber(balance)}</h2>
            <p>Current Wallet Balance</p>
            <div className="dropdown">
              <CiSettings className="dropdown-btn rotate" onClick={toggleDropdown} />
              <ul className={`dropdown-content ${dropdownOpen ? '' : 'hidden'}`}>
                <li onClick={() => openModal('fund')}>Load Wallet</li>
                <li onClick={() => openModal('transfer')}>Transfer</li>
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

      <FundWalletModal closeModal={closeModal} isOpen={fwOpen} />
      <TransferWalletModal closeModal={closeModal} isOpen={twOpen} />

      <div className="disclaimer">
        <em>Disclaimer: This app is for demonstration purpose. No real money is funded and no real value is gotten for successful recharges and bills payments.</em>
      </div>
    </>
  )
}