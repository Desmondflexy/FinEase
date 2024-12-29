import { useState, useEffect } from "react";
import { ApiStatus, IUser } from "../../../utils/types";
import AppError from "../../AppError";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "../../../api.service";
import Loading from "../../Loading";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { APP_ROUTES } from "../../../utils/constants";

export default function UsersList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [state, setState] = useState<IState>({
        users: [],
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: '/' },
        totalPages: 1,
        fetchingData: false,
        apiMeta: {
            itemCount: 0,
            totalItems: 0,
            totalPages: 1,
        },
        pgSize: 10,
    });

    const { register, watch, } = useForm<{ search: string }>();
    const searchTerm = watch("search");

    const { apiStatus, error, apiMeta, users, pgSize } = state;

    const page = Number(searchParams.get('page'));

    useEffect(() => {
        apiService.getAllUsers(page, pgSize, searchTerm)
            .then(res => {
                const { users, links, meta } = res.data;

                if (page > meta.totalPages) {
                    navigate(`${APP_ROUTES.ALL_USERS}?page=${meta.totalPages}`);
                    return;
                }
                setState(s => ({
                    ...s,
                    users,
                    apiStatus: ApiStatus.SUCCESS,
                    fetchingData: false,
                    apiMeta: meta,
                    apiLinks: links,
                }));
            }).catch(err => {
                if (page < 1) {
                    navigate(`${APP_ROUTES.ALL_USERS}?page=1`);
                    return;
                }
                setState(s => ({ ...s, apiStatus: ApiStatus.ERROR }));
                toastError(err, toast);
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
    }, [page, navigate, searchTerm, pgSize]);

    function handleNext() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`${APP_ROUTES.ALL_USERS}?page=${page + 1}`);
    }

    function handlePrevious() {
        setState(s => ({ ...s, fetchingData: true }));
        navigate(`${APP_ROUTES.ALL_USERS}?page=${page - 1}`);
    }

    function handlePgSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setState(s => ({ ...s, pgSize: +e.target.value }));
    }

    if (apiStatus === ApiStatus.SUCCESS) {
        return <section id="admin">
            <h3>Active Users</h3>
            <input type="search" placeholder="Search for user" {...register("search")} />
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
                            <th><span>Name</span></th>
                            <th><span>Username</span></th>
                            <th><span>Email</span></th>
                            <th><span>Phone</span></th>
                            <th><span>Date Registered</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: IUser, index: number) => (
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
        return <AppError code={error.status} message={error.statusText} goto={error.goto} />
    }

    return <Loading />;
}

type IState = {
    users: IUser[];
    apiStatus: ApiStatus;
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
    pgSize: number;
}