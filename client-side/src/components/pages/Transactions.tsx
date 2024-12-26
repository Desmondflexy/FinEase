import React, { useEffect, useState } from "react";
import Error from "./Error";
import { formatDateTime, formatNumber, handleError } from "../../utils/helpers";
import Loading from "./Loading";
import { ApiStatus, ITransaction } from "../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../../api.service";
import { toast } from "react-toastify";

export default function Transactions() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<IState>({
        transactions: [],
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: '/' },
        searchTerm: '',
        searchResults: [],
        fetchingData: true,
        apiMeta: {
            itemCount: 0,
            totalItems: 0,
            totalPages: 1,
        },
    });

    const page = Number(searchParams.get('page'));
    const navigate = useNavigate();
    const { apiStatus, error, searchTerm, searchResults, apiMeta } = state;

    useEffect(() => {
        apiService.fetchTransactions(page)
            .then(res => {
                const { transactions, links, meta } = res.data;

                if (page > meta.totalPages) {
                    navigate(`/account/transactions?page=${meta.totalPages}`);
                    return;
                }
                setState(s => ({
                    ...s,
                    transactions,
                    apiStatus: ApiStatus.SUCCESS,
                    searchResults: transactions,
                    fetchingData: false,
                    apiMeta: meta,
                    apiLinks: links,
                }));
            }).catch(err => {
                if (page < 1) {
                    navigate(`/account/transactions?page=1`);
                    return;
                }
                const { status, statusText } = err.response;
                handleError(err, toast);
                setState(s => ({
                    ...s,
                    apiStatus: ApiStatus.ERROR,
                    error: { ...s.error, status, statusText }
                }));
            });
        setState(s => ({ ...s, searchResults: s.transactions }));
    }, [page, navigate]);

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;
        setState(s => ({
            ...s,
            searchTerm: text,
            searchResults: s.transactions.filter(trx => {
                const searchPool = [
                    trx.amount,
                    trx.type,
                    trx.description.toLowerCase(),
                    trx.reference.toLowerCase(),
                ];
                return searchPool.some(item => item.toString().includes(text.toLowerCase().trim()));
            })
        }));
    }

    function handleNext() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`/account/transactions?page=${page + 1}`);
    }

    function handlePrevious() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`/account/transactions?page=${page - 1}`);
    }

    if (apiStatus === ApiStatus.SUCCESS) {
        return <section id="all-transactions">
            <h1>Transactions</h1>
            <input value={searchTerm} onChange={handleSearch} type="search" placeholder="Search transaction..." />
            <hr />
            <div className="table">

            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th className="table-desc">Description</th>
                            <th>Reference</th>
                            <th style={{ width: '130px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length
                            ? searchResults.map((trx: ITransaction, index: number) => (
                                <tr key={trx.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatNumber(+trx.amount).slice(3)}</td>
                                    <td>{trx.type}</td>
                                    <td>{trx.description}</td>
                                    <td>{trx.reference}</td>
                                    <td>{formatDateTime(trx.createdAt)}</td>
                                </tr>
                            ))
                            : <tr><td colSpan={6}>No transactions found</td></tr>}
                    </tbody>
                </table>
            </div>
            {apiMeta.totalPages === 1 ? null :
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center' }}>
                    <button disabled={!state.apiLinks?.previous} onClick={handlePrevious}>Prev Page</button>
                    <span>{state.fetchingData ? `fetching data on page ${page}...` : `PAGE ${page}`}</span>
                    <button disabled={!state.apiLinks?.next} onClick={handleNext}>Next Page</button>
                </div>}
            <p>Showing {apiMeta.itemCount} of {apiMeta.totalItems} transactions</p>
        </section>
    }

    if (apiStatus === ApiStatus.ERROR) {
        return <Error code={error.status} message={error.statusText} goto={error.goto} />
    }

    return <Loading />
}

type IState = {
    transactions: ITransaction[];
    apiStatus: ApiStatus;
    error: {
        status: number;
        statusText: string;
        goto: string;
    };
    searchTerm: string;
    searchResults: ITransaction[];
    fetchingData: boolean;
    apiMeta: {
        itemCount: number;
        totalItems: number;
        totalPages: number;
    };
    apiLinks?: {
        first: string;
        last: string;
        previous: string;
        next: string;
    };
}