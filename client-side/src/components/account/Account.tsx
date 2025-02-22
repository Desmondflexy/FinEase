import { useLocation, Link, useNavigate, Routes, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { CgProfile } from "react-icons/cg";
import AppError from "../AppError";
import { IoMenu } from "react-icons/io5";
import SideBar from "../SideBar";
import { apiService } from "../../api.service";
import AdminApp from "./admin/AdminApp";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Recharge from "./recharge/Recharge";
import Settings from "./Settings";
import Transactions from "./Transactions";
import { ApiStatus, FineaseRoute } from "../../utils/constants";
import UserProvider from "../../providers/UserProvider";
import Receipts from "./Receipts";
import { getRoutePath } from "../../utils/helpers";
import Features from "./Features";

export default function Account() {
    const [user, setUser] = useState<IUser | null>(null);
    const paths = useLocation().pathname.split('/');
    const location = paths[paths.length - 1];
    const token = localStorage.getItem('token');
    const [state, setState] = useState<IState>({
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: FineaseRoute.HOME },
        isVisible: { sideBar: false },
    });

    const { apiStatus, error } = state;

    useEffect(() => {
        document.title = 'FinEase - Account';
    }, []);

    const navigate = useNavigate();

    if (!token) {
        navigate(FineaseRoute.LOGIN);
    }

    if (paths.includes('admin') && user && !user.isAdmin) {
        navigate(FineaseRoute.DASHBOARD);
    }


    useEffect(() => {
        apiService.getAccountInfo().then(res => {
            setUser(res.data.user);
            setState(s => ({ ...s, apiStatus: ApiStatus.SUCCESS }));
        }).catch(err => {
            setState(s => ({ ...s, apiStatus: ApiStatus.ERROR }));
            if (err.response) {
                const { status, statusText } = err.response;
                setState(s => ({
                    ...s,
                    error: { status, statusText, goto: status >= 400 && status <= 499 ? FineaseRoute.LOGIN : s.error.goto }
                }));
            } else {
                setState(s => ({ ...s, error: { ...s.error, status: 500, statusText: err.message } }));
            }
        });
    }, [token, location]);


    if (apiStatus === ApiStatus.LOADING) {
        return <Loading />
    }

    if (apiStatus === ApiStatus.SUCCESS && user) {
        return (
            <UserProvider value={{ user, setUser }}>
                <div id="app-layout">

                    {/* header */}
                    <div className="app-header text-secondary bg-white">
                        <ul>
                            <li><IoMenu size={30} data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" /></li>
                            <li><Link className="navbar-brand" to='/'>FinEase</Link></li>
                            <li>
                                <div className="dropdown">
                                    <button className="btn dropdown-toggle d-flex gap-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ alignItems: 'center' }}>
                                        <CgProfile /><span>{user.username}</span>
                                    </button>
                                    <ul className="dropdown-menu" style={{ fontSize: '12px' }}>
                                        <li><Link className="dropdown-item" to={FineaseRoute.PROFILE}>Profile</Link></li>
                                        <li><Link className="dropdown-item" to={FineaseRoute.LOGOUT}>Logout</Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* main */}
                    <div className="app-body">
                        <SideBar />

                        <main className="main p-3">
                            <Outlet />
                        </main>

                        {/* footer */}
                        <footer className="app-footer p-3">
                            <p>© 2024 FinEase. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </UserProvider>
        );
    }

    return <AppError code={error.status} message={error.statusText} goto={error.goto} />;
}

type IState = {
    apiStatus: ApiStatus;
    error: {
        status: number;
        statusText: string;
        goto: string;
    };
    isVisible: {
        sideBar: boolean;
    }
}

function Outlet() {
    return (
        <Routes>
            <Route index element={<Navigate to={getRoutePath(FineaseRoute.DASHBOARD)} />} />
            <Route path={getRoutePath(FineaseRoute.DASHBOARD)} element={<Dashboard />} />
            <Route path={getRoutePath(FineaseRoute.PROFILE)} element={<Profile />} />
            <Route path={getRoutePath(FineaseRoute.TRANSACTIONS)} element={<Transactions />} />
            <Route path={getRoutePath(FineaseRoute.RECHARGE, true)} element={<Recharge />} />
            <Route path={getRoutePath(FineaseRoute.SETTINGS)} element={<Settings />} />
            <Route path={getRoutePath(FineaseRoute.ADMIN_AREA, true)} element={<AdminApp />} />
            <Route path={getRoutePath(FineaseRoute.RECEIPTS)} element={<Receipts />} />
            <Route path={getRoutePath(FineaseRoute.FEATURES, true)} element={<Features />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={''} />} />
        </Routes>
    );
}