import { useState, useEffect } from "react";
import { ApiStatus, IUser } from "../../utils/types";
import Error from "./Error";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "../../api.service";
import Loading from "./Loading";
import { handleError } from "../../utils/helpers";
import { toast } from "react-toastify";

export default function UsersList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [state, setState] = useState<IState>({
        users: [],
        apiStatus: ApiStatus.LOADING,
        searchTerm: '',
        searchResults: [],
        error: { status: 0, statusText: '', goto: '/' },
        totalPages: 1,
        fetchingData: false,
        apiMeta: {
            itemCount: 0,
            totalItems: 0,
            totalPages: 1,
        },
    });

    const { apiStatus, searchTerm, searchResults, error, apiMeta } = state;

    const page = Number(searchParams.get('page'));

    useEffect(() => {
        apiService.getAllUsers(page)
            .then(res => {
                const { users, links, meta } = res.data;

                if (page > meta.totalPages) {
                    navigate(`/account/all-users?page=${meta.totalPages}`);
                    return;
                }
                setState(s => ({
                    ...s,
                    users,
                    apiStatus: ApiStatus.SUCCESS,
                    searchResults: users,
                    fetchingData: false,
                    apiMeta: meta,
                    apiLinks: links,
                }));
            }).catch(err => {
                if (page < 1) {
                    navigate(`/account/all-users?page=1`);
                    return;
                }
                setState(s => ({ ...s, apiStatus: ApiStatus.ERROR }));
                handleError(err, toast);
                if (err.response) {
                    const { status, statusText } = err.response;
                    setState(s => ({
                        ...s,
                        error: {
                            ...s.error,
                            status,
                            statusText,
                            goto: status >= 401 && status <= 499 ? '/auth/login' : s.error.goto
                        }
                    }));
                } else {
                    setState(s => ({ ...s, error: { ...s.error, status: 500, statusText: err.message } }));
                }
            });
    }, [page, navigate]);
    
    useEffect(() => {
        setState(s => ({ ...s, searchResults: s.users }));
    }, []);

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

    function handleNext() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`/account/all-users?page=${page + 1}`);
    }

    function handlePrevious() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`/account/all-users?page=${page - 1}`);
    }

    if (apiStatus === ApiStatus.SUCCESS) {
        return <section id="admin">
            <h1>Active Users</h1>
            <input type="search" placeholder="Search for user" onChange={handleSearch} value={searchTerm} />
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
                            <tr key={user.id}>
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
            </div>
            {apiMeta.totalPages === 1 ? null :
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center' }}>
                    <button disabled={!state.apiLinks?.previous} onClick={handlePrevious}>Prev Page</button>
                    <span>{state.fetchingData ? `fetching data on page ${page}...` : `PAGE ${page}`}</span>
                    <button disabled={!state.apiLinks?.next} onClick={handleNext}>Next Page</button>
                </div>}
            <p>Showing {apiMeta.itemCount} of {apiMeta.totalItems} users</p>
        </section>;
    }

    if (apiStatus === ApiStatus.ERROR) {
        return <Error code={error.status} message={error.statusText} goto={error.goto} />
    }

    return <Loading />;
}

type IState = {
    users: IUser[];
    apiStatus: ApiStatus;
    searchTerm: string;
    searchResults: IUser[];
    error: {
        status: number;
        statusText: string;
        goto: string;
    },
    totalPages: number;
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