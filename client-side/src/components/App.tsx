import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home'
import AppError from './AppError';
import Auth from './auth/Auth';
import Signup from './auth/Signup';
import Account from './account/Account';
import { Login } from './auth/Login';
import { Logout } from './auth/Logout';
import ForgotPassword from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';
import VerifyEmail from './auth/VerifyEmail';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/auth' element={<Auth />}>
                    <Route index element={<Navigate to='login' />} />
                    <Route path='signup' element={<Signup admin={false} />} />
                    <Route path='admin-signup' element={<Signup admin={true} />} />
                    <Route path='login' element={<Login />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='forgot-password' element={<ForgotPassword />} />
                    <Route path='reset-password/:resetId' element={<ResetPassword />} />
                    <Route path='verify-email/:verifyId' element={<VerifyEmail />} />
                </Route>
                <Route path='/account/*' element={<Account />} />
                <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={'/'} />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    )
}