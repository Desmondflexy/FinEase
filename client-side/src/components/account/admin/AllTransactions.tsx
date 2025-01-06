import { useCallback, useEffect, useState } from "react";
import { formatDateTime, formatNumber, toastError } from "../../../utils/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../../../api.service";
import { toast } from "react-toastify";
import { FineaseRoute } from "../../../utils/constants";
import { PageSizeSelector } from "../../extras/PageSizeSelector";
import { SearchBox } from "../../extras/SearchForm";

export default function Transactions() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        transactions: [] as ITransaction[],
        meta: {
            itemCount: 0,
            totalItems: 0,
            totalPages: 0
        },
        links: {
            next: '',
            previous: ''
        },
        isLoading: true,
    });
    const { transactions, isLoading, meta, links } = data;
    const [limit, setLimit] = useState(10);
    const page = Number(searchParams.get('page'));
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(fetchTransactions, [page, navigate, searchTerm, limit]);

    let nextBtnDisabled = !links?.next, prevBtnDisabled = !links?.previous;
    if (isLoading) nextBtnDisabled = true, prevBtnDisabled = true;

    function fetchTransactions() {
        if (page < 1) {
            navigate(`${FineaseRoute.ALL_TRANSACTIONS}?page=1`);
            return;
        }
        setData(s => ({ ...s, isLoading: true }));
        apiService.fetchAllTransactions(page, limit, searchTerm).then(res => {
            const { transactions, meta, links } = res.data;
            const lastPage = meta.totalPages;
            if (page > lastPage) {
                navigate(`${FineaseRoute.ALL_TRANSACTIONS}?page=${lastPage}`);
                return;
            }
            setData(s => ({ ...s, transactions, meta, links }));
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setData(s => ({ ...s, isLoading: false }));
            setIsPageLoading(false);
        });
    }

    function handleNext() {
        navigate(`${FineaseRoute.ALL_TRANSACTIONS}?page=${page + 1}`);
    }

    function handlePrevious() {
        navigate(`${FineaseRoute.ALL_TRANSACTIONS}?page=${page - 1}`);
    }

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    return (
        <div id="all-transactions">
            <h3>Transactions</h3>
            <SearchBox onSearch={handleSearch} />
            <hr />
            <PageSizeSelector onLimitChange={setLimit} />
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
                        {isPageLoading ? <tr><td colSpan={6}>Loading...</td></tr>
                            : !transactions.length ? <tr><td colSpan={6}>No transactions found</td></tr>
                                : transactions.map((trx, index) => (
                                    <tr key={trx.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatNumber(+trx.amount).slice(3)}</td>
                                        <td>{trx.type}</td>
                                        <td>{trx.description}</td>
                                        <td>{trx.user?.username}</td>
                                        <td>{trx.reference}</td>
                                        <td>{formatDateTime(trx.createdAt)}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {meta.totalPages > 1 &&
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center' }}>
                    <button disabled={prevBtnDisabled} onClick={handlePrevious}>Prev Page</button>
                    <span>{isLoading ? `fetching data on page ${page}...` : `PAGE ${page}`}</span>
                    <button disabled={nextBtnDisabled} onClick={handleNext}>Next Page</button>
                </div>}
            <p>Showing {meta.itemCount} of {meta.totalItems} transactions</p>
        </div>
    );
}
