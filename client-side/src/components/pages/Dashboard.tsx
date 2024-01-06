import { useEffect, useState } from "react";
// import { CiSettings } from "react-icons/ci";
import { formatDateTime, formatNumber, greet } from "../../utils/utils";
// import { FundWalletModal, TransferWalletModal } from "../Funds";
import { useOutletContext } from "react-router-dom";
import { ITransaction, IUser } from "../../types";
import Api from "../../api.config";
import { IoWalletOutline } from "react-icons/io5";
import { GiExpense } from "react-icons/gi";
import { FaMoneyBill } from "react-icons/fa";
// import Modal from "../modals/Dropdown";
import FormModal from "../modals/FormModal";
import TransferWallet from "../modals/TransferWallet";
import { FundWalletModal } from "../modals/FundWallet";

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

  // const { dropdownOpen, fwOpen, twOpen, balance, recent10 } = state;
  const { balance, recent10 } = state;

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

  // function openModal(feature: 'fund' | 'transfer') {
  //   switch (feature) {
  //     case 'fund':
  //       setState(s => ({ ...s, fwOpen: true }));
  //       break;
  //     case 'transfer':
  //       setState(s => ({ ...s, twOpen: true }));
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // function closeModal() {
  //   setState(s => ({ ...s, fwOpen: false, twOpen: false }));
  // }

  function closeDropdown(e: MouseEvent) {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn && !dropdownBtn.contains(e.target as Node)) {
      setState(s => ({ ...s, dropdownOpen: false }));
    }
  }

  // function toggleDropdown() {
  //   setState(s => ({ ...s, dropdownOpen: !dropdownOpen }));
  // }

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
    <div id="dashboard">
      <div className="message">
        <h2>{greet()} {user.fullName.split(' ')[0]}!</h2>
      </div>
      <section>
        <div className="cards mb-3">
          <div className="bg-danger text-white">
            <h2>{formatNumber(balance)}</h2>
            <p>Current Wallet Balance</p>
            <div className="wallet-icon">
              <IoWalletOutline />
            </div>
          </div>
          <div className="text-white bg-facebook">
            <h2>{formatNumber(0)}</h2>
            <p>Total Monthly Expense</p>
            <div className="wallet-icon">
              <GiExpense />
            </div>
          </div>
          <div className="bg-dark text-white">
            <h2>{formatNumber(0)}</h2>
            <p>Total Monthly Income</p>
            <div className="wallet-icon">
              <FaMoneyBill />
            </div>
          </div>
        </div>

        <div className="d-flex mb-3 gap-3">
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#fundWallet">Load Wallet</button>
          <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#transferWallet">Transfer Funds</button>
        </div>
      </section>

      <section>
        <div className="header">Recent Transactions</div>
        <div className="table-container">
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
      </section>

      <FormModal id={'transferWallet'} title="Wallet to Wallet Transfer">
        <TransferWallet />
      </FormModal>
      <FormModal id={'fundWallet'} title="Fund Wallet">
        <FundWalletModal />
      </FormModal>

      <div className=" disclaimer p-2 bg-primary-subtle text-dark mt-3">
        <em>Disclaimer: This app is for demonstration purpose. No real money is funded and no real value is gotten for successful recharges and bills payments.</em>
      </div>
    </div>
  )
}