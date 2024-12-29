import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home'
import Profile from './account/Profile'
import Dashboard from './account/Dashboard';
import Error from './Error';
import Auth from './auth/Auth';
import Signup from './auth/Signup';
import Transactions from './account/Transactions';
import Recharge from './account/recharge/Recharge';
import Settings from './account/Settings';
import Account from './account/Account';
import { Login } from './auth/Login';
import { Logout } from './auth/Logout';
import ForgotPassword from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';
import VerifyEmail from './auth/VerifyEmail';
import AdminApp from './account/admin/AdminApp';

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
                <Route path='/account' element={<Account />}>
                    <Route index element={<Navigate to='dashboard' />} />
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='transactions' element={<Transactions />} />
                    <Route path='recharge/*' element={<Recharge />} />
                    <Route path='settings' element={<Settings />} />
                    <Route path='admin/*' element={<AdminApp />} />
                </Route>
                <Route path='*' element={<Error message={'Page Not Found'} code={404} goto={'/'} />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    )
}