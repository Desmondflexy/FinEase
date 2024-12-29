import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home'
import AppError from './AppError';
import Auth from './auth/Auth';
import Account from './account/Account';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/auth/*' element={<Auth />} />
                <Route path='/account/*' element={<Account />} />
                <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={'/'} />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}