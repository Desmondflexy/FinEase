import { useEffect, useState } from "react";
import Error from "./Error";
import { formatDateTime, formatNumber, handleError } from "../../utils/helpers";
import Loading from "./Loading";
import { ApiStatus, ITransaction } from "../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../../api.service";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { APP_ROUTES } from "../../utils/constants";

export default function AllTransactions() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<IState>({
        transactions: [],
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: '/' },
        fetchingData: true,
        apiMeta: {
            itemCount: 0,
            totalItems: 0,
            totalPages: 1,
        },
        pgSize: 10,
    });

    const { register, watch,  } = useForm<{ search: string, pgSize: string }>();
    const searchTerm = watch("search");

    const page = Number(searchParams.get('page'));
    const navigate = useNavigate();
    const { apiStatus, error, apiMeta, transactions, pgSize } = state;

    useEffect(() => {
        apiService.fetchAllTransactions(page, pgSize, searchTerm).then(res => {
            const { transactions, links, meta } = res.data;

            if (page > meta.totalPages) {
                navigate(`${APP_ROUTES.ALL_TRANSACTIONS}?page=${meta.totalPages}`);
                return;
            }
            setState(s => ({
                ...s,
                transactions,
                apiStatus: ApiStatus.SUCCESS,
                fetchingData: false,
                apiMeta: meta,
                apiLinks: links,
            }));
        }).catch(err => {
            if (page < 1) {
                navigate(`${APP_ROUTES.ALL_TRANSACTIONS}page=1`);
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
    }, [page, navigate, searchTerm, pgSize]);

    function handleNext() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`${APP_ROUTES.ALL_TRANSACTIONS}?page=${page + 1}`);
    }

    function handlePrevious() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`${APP_ROUTES.ALL_TRANSACTIONS}?page=${page - 1}`);
    }

    function handlePgSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setState(s => ({ ...s, pgSize: +e.target.value }));
    }

    if (apiStatus === ApiStatus.SUCCESS) {
        return <section id="all-transactions">
            <h3>All Transactions</h3>
            <input {...register("search")} type="search" placeholder="Search transaction..." />
            <hr />

            <div className="pg-size">
                <label htmlFor="pg-size">Size: </label>
                <select name="pg-size" id="pg-size" onChange={handlePgSizeChange} value={pgSize}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th className="table-desc">Description</th>
                            <th>User</th>
                            <th>Reference</th>
                            <th style={{ width: '130px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length
                            ? transactions.map((trx: ITransaction, index: number) => (
                                <tr key={trx.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatNumber(+trx.amount).slice(3)}</td>
                                    <td>{trx.type}</td>
                                    <td>{trx.description}</td>
                                    <td>{trx.user?.username}</td>
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
    pgSize: number;
}