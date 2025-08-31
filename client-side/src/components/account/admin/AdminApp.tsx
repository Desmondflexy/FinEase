import { Link, Navigate, Route, Routes } from "react-router-dom"
import AllTransactions from "./AllTransactions"
import AllUsers from "./AllUsers"
import AppError from "../../AppError"
import AddDevice from "./AddDevice";
import Devices from "./Devices";
import { getRoutePath } from "../../../utils/helpers";
import { FineaseRoute } from "../../../utils/constants";
import { AdminExtras, PasswordComplexity } from "./Extras";

export default function AdminApp() {
    return (
        <section id="admin-app">
            <ul className="nav">
                <li><Link to={FineaseRoute.ALL_USERS}>Users</Link></li>
                <li><Link to={FineaseRoute.ALL_TRANSACTIONS}>Transactions</Link></li>
                <li><Link to={FineaseRoute.DEVICES}>Devices</Link></li>
                <li><Link to={FineaseRoute.ADD_DEVICE}>Add Device</Link></li>
                <li><Link to={FineaseRoute.ADMIN_EXTRAS}>Extras</Link></li>
            </ul>

            <Outlet />
        </section>
    );
}

function Outlet() {
    return (
        <Routes>
            <Route index element={<Navigate to={getRoutePath(FineaseRoute.ALL_USERS)} />} />
            <Route path={getRoutePath(FineaseRoute.ALL_USERS)} element={<AllUsers />} />
            <Route path={getRoutePath(FineaseRoute.ALL_TRANSACTIONS)} element={<AllTransactions />} />
            <Route path={getRoutePath(FineaseRoute.DEVICES)} element={<Devices />} />
            <Route path={getRoutePath(FineaseRoute.ADD_DEVICE)} element={<AddDevice isAdmin={true} />} />
            <Route path={getRoutePath(FineaseRoute.ADMIN_EXTRAS)} element={<AdminExtras />} />
            <Route path={getRoutePath(FineaseRoute.PASSWORD_COMPLEXITY)} element={<PasswordComplexity />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={''} />} />
        </Routes>
    );
}

