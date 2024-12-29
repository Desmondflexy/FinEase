import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { CgProfile } from "react-icons/cg";
import Error from "../Error";
import { ApiStatus, IUser } from "../../utils/types";
import { IoMenu } from "react-icons/io5";
import SideBar from "../SideBar";
import { apiService } from "../../api.service";

export default function Account() {
    const [user, setUser] = useState<IUser | null>(null);
    const location = useLocation().pathname.split('/')[2];
    const token = localStorage.getItem('token');
    const [state, setState] = useState<IState>({
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: '/' },
        isVisible: { sideBar: false },
    });

    const { apiStatus, error } = state;

    useEffect(() => {
        document.title = 'FinEase | Account';
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/auth/login");
        }
    });


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
                    error: { status, statusText, goto: status >= 400 && status <= 499 ? '/auth/login' : s.error.goto }
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
                                    <li><Link className="dropdown-item" to="/account/profile">Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/auth/logout">Logout</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* main */}
                <div className="app-body">
                    <SideBar user={user} />

                    <main className="main p-3">
                        <Outlet context={[user, setUser]} />
                    </main>

                    {/* footer */}
                    <footer className="app-footer p-3">
                        <p>© 2024 FinEase. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        );
    }

    if (apiStatus === ApiStatus.ERROR) {
        return (
            <Error code={error.status} message={error.statusText} goto={error.goto} />
        );
    }
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