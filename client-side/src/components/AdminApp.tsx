import { Link, Outlet } from "react-router-dom"

export default function AdminApp() {
    return (
        <section id="admin-app">
            <ul className="nav">
                <li><Link to="users?page=1">Users</Link></li>
                <li><Link to="transactions?page=1">Transactions</Link></li>
            </ul>
            <Outlet />
        </section>
    )
}