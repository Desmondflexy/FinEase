import Api from "../../api.config";
import { useState, useEffect } from "react";
import { IUser } from "../../types";
import Error from "./Error";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function UsersList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [state, setState] = useState<IState>({
        users: [],
        apiStatus: 'loading',
        searchTerm: '',
        searchResults: [],
        error: { status: 0, statusText: '', goto: '/' },
        totalPages: 1,
        fetchingTransactions: false,
    });

    const { apiStatus, searchTerm, searchResults, error } = state;

    const page = Number(searchParams.get('page')) || 1;

    useEffect(() => fetchUsers(page), [page]);
    useEffect(() => {
        setState(s => ({ ...s, searchResults: s.users }));
    }, []);

    if (apiStatus === 'success') {
        return <section id="admin">
            <h1>List of all active users of FinEase</h1>
            <input type="search" placeholder="Search for user..." onChange={handleSearch} value={searchTerm} />
            <hr />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th><span>Name</span></th>
                            <th><span>Username</span></th>
                            <th><span>Email</span></th>
                            <th><span>Phone</span></th>
                            <th><span>Date Registered</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((user: IUser, index: number) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.fullName}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.createdAt.split('T')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {page === state.totalPages && page === 1 ? null :
                    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center' }}>
                        <button disabled={page === 1} onClick={handlePrevious}>Prev Page</button>
                        <span>{state.fetchingTransactions ? `fetching data on page ${page}...` : `PAGE ${page}`}</span>
                        <button disabled={page === state.totalPages} onClick={handleNext}>Next Page</button>
                    </div>}
            </div>
        </section>;
    }

    if (apiStatus === 'error') {
        return <Error code={error.status} message={error.statusText} goto={error.goto} />
    }


    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;
        setState(s => ({
            ...s,
            searchTerm: text,
            searchResults: s.users.filter(user => {
                const { fullName, email, phone, acctNo } = user;
                const searchPool = [
                    fullName.toLowerCase(),
                    email.toLowerCase(),
                    phone.toLowerCase(),
                    acctNo.toLowerCase()
                ];
                return searchPool.some(item => item.includes(text.toLowerCase().trim()));
            })
        }));
    }

    function fetchUsers(page: number) {
        Api.get(`/account/all-users?page=${page}`)
            .then(res => {
                const { totalPages, users } = res.data;
                setState(s => ({ ...s, apiStatus: 'success', users, searchResults: users, totalPages, fetchingTransactions: false }));
            })
            .catch(err => {
                console.error(err.message);
                setState(s => ({ ...s, apiStatus: 'error' }));
                if (err.response) {
                    const { status, statusText } = err.response;
                    setState(s => ({
                        ...s,
                        error: {
                            ...s.error,
                            status,
                            statusText,
                            goto: status >= 400 && status <= 499 ? '/auth/login' : s.error.goto
                        }
                    }));
                } else {
                    setState(s => ({ ...s, error: { ...s.error, status: 500, statusText: err.message } }));
                }
            });
    }

    function handleNext() {
        setState(s => ({ ...s, fetchingTransactions: true }));
        navigate(`/account/all-users?page=${page + 1}`);
    }

    function handlePrevious() {
        setState(s => ({ ...s, fetchingTransactions: true }));
        navigate(`/account/all-users?page=${page - 1}`);
    }

    interface IState {
        users: IUser[];
        apiStatus: 'loading' | 'success' | 'error';
        searchTerm: string;
        searchResults: IUser[];
        error: {
            status: number;
            statusText: string;
            goto: string;
        },
        totalPages: number;
        fetchingTransactions: boolean;
    }
}