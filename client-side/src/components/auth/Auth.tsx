import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { ResetPassword } from "./ResetPassword";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";
import { FineaseRoute } from "../../utils/constants";
import { getRoutePath } from "../../utils/helpers";
import AppError from "../AppError";

export default function Auth() {
    return (
        <div className="get-started">
            <Header />
            <div className="form-container">
                <FormNav />
                <Outlet />
            </div>
        </div>
    );
}

function FormNav() {
    const [active, setActive] = useState("");
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === FineaseRoute.LOGIN) {
            setActive(FineaseRoute.LOGIN);
        } else {
            setActive(FineaseRoute.SIGNUP);
        }
    }, [location.pathname]);

    return (
        <ul className="nav nav-tabs">
            <li className='nav-item'>
                <Link to={FineaseRoute.SIGNUP} className={`nav-link ${active === FineaseRoute.SIGNUP ? "active" : ""}`}>Signup</Link>
            </li>
            <li className="nav-item">
                <Link to={FineaseRoute.LOGIN} className={`nav-link ${active === FineaseRoute.LOGIN ? "active" : ""}`}>Login</Link>
            </li>
        </ul>
    );
}

export function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div className="container">
                <Link to='/' className="navbar-brand" >FinEase</Link>
            </div>
        </nav>
    );
}

function Outlet() {
    return (
        <Routes>
            <Route index element={<Navigate to={getRoutePath(FineaseRoute.LOGIN)} />} />
            <Route path={getRoutePath(FineaseRoute.SIGNUP)} element={<Signup admin={false} />} />
            <Route path={getRoutePath(FineaseRoute.ADMIN_SIGNUP)} element={<Signup admin={true} />} />
            <Route path={getRoutePath(FineaseRoute.LOGIN)} element={<Login />} />
            <Route path={getRoutePath(FineaseRoute.LOGOUT)} element={<Logout />} />
            <Route path={getRoutePath(FineaseRoute.FORGOT_PASSWORD)} element={<ForgotPassword />} />
            <Route path={getRoutePath(FineaseRoute.RESET_PASSWORD)} element={<ResetPassword />} />
            <Route path={getRoutePath(FineaseRoute.VERIFY_EMAIL)} element={<VerifyEmail />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={FineaseRoute.LOGIN} />} />
        </Routes>
    );
}