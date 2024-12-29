import { Link, Navigate, Route, Routes } from "react-router-dom"
import AllTransactions from "./AllTransactions"
import AllUsers from "./AllUsers"
import AppError from "../../AppError"

export default function AdminApp() {
    return (
        <section id="admin-app">
            <ul className="nav">
                <li><Link to="users?page=1">Users</Link></li>
                <li><Link to="transactions?page=1">Transactions</Link></li>
            </ul>

            <Outlet />
        </section>
    );
}

function Outlet() {
    return (
        <Routes>
            <Route index element={<Navigate to='users?page=1' />} />
            <Route path='users' element={<AllUsers />} />
            <Route path='transactions' element={<AllTransactions />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={''} />} />
        </Routes>
    );
}