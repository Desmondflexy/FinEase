import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { ResetPassword } from "./ResetPassword";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";

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
        if (location.pathname === '/auth/login') {
            setActive('/auth/login');
        } else {
            setActive('/auth/signup');
        }
    }, [location.pathname]);

    return (
        <ul className="nav nav-tabs">
            <li className='nav-item'>
                <Link to='/auth/signup' className={`nav-link ${active === '/auth/signup' ? "active" : ""}`}>Signup</Link>
            </li>
            <li className="nav-item">
                <Link to='/auth/login' className={`nav-link ${active === '/auth/login' ? "active" : ""}`}>Login</Link>
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
            <Route index element={<Navigate to='login' />} />
            <Route path='signup' element={<Signup admin={false} />} />
            <Route path='admin-signup' element={<Signup admin={true} />} />
            <Route path='login' element={<Login />} />
            <Route path='logout' element={<Logout />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password/:resetId' element={<ResetPassword />} />
            <Route path='verify-email/:verifyId' element={<VerifyEmail />} />
            <Route path='*' element={<Navigate to='login' />} />
        </Routes>
    );
}