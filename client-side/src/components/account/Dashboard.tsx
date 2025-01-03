import { useEffect, useState } from "react";
import { formatDateTime, formatNumber, greet } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { ITransaction } from "../../utils/types";
import { IoWalletOutline } from "react-icons/io5";
import { GiExpense } from "react-icons/gi";
import FormModal from "../modals/FormModal";
import TransferWallet from "../modals/TransferWallet";
import { FundWalletModal } from "../modals/FundWallet";
import { apiService } from "../../api.service";
import { useUser } from "../../utils/hooks";
import { FineaseRoute } from "../../utils/constants";

export default function Dashboard() {
    const { user } = useUser();
    const [state, setState] = useState<IState>({
        balance: formatNumber(user.balance),
        recent10: [],
        modal: {
            fundWallet: false,
            transferWallet: false,
        },
        totalExpense: "NGN ...",
    });

    const { balance, recent10, totalExpense } = state;

    useEffect(getRecentTransactions, []);
    useEffect(getMonthlyExpense, []);

    function getRecentTransactions() {
        apiService.getRecentTransactions().then(res => {
            setState(s => ({ ...s, recent10: res.data.transactions }));
        }).catch(err => {
            console.error(err.response.data);
        });
    }

    function getMonthlyExpense() {
        apiService.getMonthlyExpense().then(res => {
            setState(s => ({ ...s, totalExpense: formatNumber(res.data.total) }));
        }).catch(err => {
            console.error(err.response.data);
        })
    }

    function toggleModal(modal: 'fundWallet' | 'transferWallet') {
        const modalElement = document.getElementById(modal);
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        }
        setState(s => ({ ...s, modal: { ...s.modal, [modal]: !s.modal[modal] } }));
    }

    return (
        <div id="dashboard">
            <div className="message">
                <h2>{greet()} {user.fullName.split(' ')[0]}!</h2>
            </div>
            <section>
                <div className="cards mb-3">
                    <div className="bg-danger text-white">
                        <h2>{balance}</h2>
                        <p>Current Wallet Balance</p>
                        <div className="wallet-icon">
                            <IoWalletOutline />
                        </div>
                    </div>
                    <div className="text-white bg-facebook">
                        <h2>{totalExpense}</h2>
                        <p>Total Monthly Expense</p>
                        <div className="wallet-icon">
                            <GiExpense />
                        </div>
                    </div>
                </div>

                <div className="d-flex mb-3 gap-3">
                    <button onClick={() => toggleModal('fundWallet')} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#fundWallet">Load Wallet</button>
                    <button onClick={() => toggleModal('transferWallet')} className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#transferWallet">Transfer Funds</button>
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
                                <th style={{ width: '130px' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent10.map((trx: ITransaction, index: number) => (
                                <tr key={trx.id}>
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
                <Link to={FineaseRoute.TRANSACTIONS + '?page=1'} className="btn btn-primary my-2 btn-sm">See more</Link>
            </section>

            <FormModal closeModal={() => toggleModal('transferWallet')} id='transferWallet' title="Wallet to Wallet Transfer">
                <TransferWallet closeModal={() => toggleModal('transferWallet')} />
            </FormModal>
            <FormModal closeModal={() => toggleModal('fundWallet')} id='fundWallet' title="Fund Wallet">
                <FundWalletModal closeModal={() => toggleModal('fundWallet')} />
            </FormModal>

            <div className=" disclaimer p-2 bg-primary-subtle text-dark mt-3">
                {/* <em>Disclaimer: This app is for demonstration purpose. No real money is funded and no real value is gotten for successful recharges and bills payments.</em> */}
            </div>
        </div>
    )
}

type IState = {
    balance: string;
    recent10: ITransaction[];
    modal: {
        fundWallet: boolean;
        transferWallet: boolean;
    },
    totalExpense: string;
}

declare class Modal {
    constructor(element: HTMLElement);
    static getInstance(element: HTMLElement): Modal;
    show(): void;
    hide(): void;
}

declare const bootstrap: {
    Modal: typeof Modal;
};