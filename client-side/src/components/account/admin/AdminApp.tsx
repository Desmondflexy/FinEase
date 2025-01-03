import { Link, Navigate, Route, Routes } from "react-router-dom"
import AllTransactions from "./AllTransactions"
import AllUsers from "./AllUsers"
import AppError from "../../AppError"
import AddDevice from "./AddDevice";
import Devices from "./Devices";
import DeviceInfo from "./DeviceInfo";

export default function AdminApp() {
    return (
        <section id="admin-app">
            <ul className="nav">
                <li><Link to="users?page=1">Users</Link></li>
                <li><Link to="transactions?page=1">Transactions</Link></li>
                <li><Link to="devices">Devices</Link></li>
                <li><Link to="add-device">Add Device</Link></li>
                <li><Link to="approvals">Approvals</Link></li>
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
            <Route path='devices' element={<Devices />} />
            <Route path='add-device' element={<AddDevice />} />
            <Route path='devices/:id' element={<DeviceInfo />} />
            <Route path='approvals' element={<AdminApprovals />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={''} />} />
        </Routes>
    );
}

function AdminApprovals() {
    return (
        <div>
            <h3>Applications</h3>
            <li>List of applications</li>
            <li>New admin requests</li>
            <li>New devices registered by users</li>
            <p style={{ color: "red" }}>Coming soon...</p>
        </div>
    )
}