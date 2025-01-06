import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home'
import AppError from './components/AppError';
import Auth from './components/auth/Auth';
import Account from './components/account/Account';
import { FineaseRoute } from './utils/constants';
import { getRoutePath } from './utils/helpers';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={getRoutePath(FineaseRoute.HOME)} element={<Home />} />
                <Route path={getRoutePath(FineaseRoute.AUTH, true)} element={<Auth />} />
                <Route path={getRoutePath(FineaseRoute.ACCOUNT, true)} element={<Account />} />
                <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={FineaseRoute.HOME} />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}
