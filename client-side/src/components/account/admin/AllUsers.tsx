import { useState, useEffect, useCallback } from "react";
import { toastError } from "../../../utils/helpers";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "../../../api.service";
import { toast } from "react-toastify";
import { FineaseRoute } from "../../../utils/constants";
import { PageSizeSelector } from "../../extras/PageSizeSelector";
import { SearchBox } from "../../extras/SearchForm";

export default function UsersList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [data, setData] = useState({
        users: [] as IUser[],
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



    const { users, isLoading, meta, links } = data;
    const [limit, setLimit] = useState(10);
    const page = Number(searchParams.get('page'));
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(fetchAllUsers, [page, navigate, searchTerm, limit]);

    let nextBtnDisabled = !links.next, prevBtnDisabled = !links.previous;
    if (isLoading) nextBtnDisabled = true, prevBtnDisabled = true;

    function fetchAllUsers() {
        if (page < 1) {
            navigate(`${FineaseRoute.ALL_USERS}?page=1`);
            return;
        }
        setData(s => ({ ...s, isLoading: true }));
        apiService.getAllUsers(page, limit, searchTerm).then(res => {
            const { users, links, meta } = res.data;
            const lastPage = meta.totalPages;
            if (lastPage > meta.totalPages) {
                navigate(`${FineaseRoute.ALL_USERS}?page=${lastPage}`);
                return;
            }
            setData(s => ({ ...s, users, meta, links }));
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setData(s => ({ ...s, isLoading: false }));
            setIsPageLoading(false);
        });
    }

    function handleNext() {
        navigate(`${FineaseRoute.ALL_USERS}?page=${page + 1}`);
    }

    function handlePrevious() {
        navigate(`${FineaseRoute.ALL_USERS}?page=${page - 1}`);
    }

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    return (
        <div id="all-users">
            <h3>Active Users</h3>
            <SearchBox onSearch={handleSearch} />
            <hr />
            <PageSizeSelector onLimitChange={setLimit} />
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
                        {isPageLoading ? <tr><td colSpan={6}>Loading data...</td></tr>
                            : !users.length ? <tr><td colSpan={6}>No users found</td></tr>
                                : users.map((user, index) => (
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

            {meta.totalPages > 1 &&
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center' }}>
                    <button disabled={prevBtnDisabled} onClick={handlePrevious}>Prev Page</button>
                    <span>{isLoading ? `fetching data on page ${page}...` : `PAGE ${page}`}</span>
                    <button disabled={nextBtnDisabled} onClick={handleNext}>Next Page</button>
                </div>}
            <p>Showing {meta.itemCount} of {meta.totalItems} users</p>
        </div>
    );
}