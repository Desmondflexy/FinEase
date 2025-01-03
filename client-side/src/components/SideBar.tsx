import { Link, useLocation } from "react-router-dom";
import { IUser } from "../utils/types";
import { FineaseRoute } from "../utils/constants";

function SideBar({ user }: { user: IUser }) {
    const location = useLocation().pathname.split('/')[2];

    return (
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">{user.fullName}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group list-group-flush m-0">
                    <Link to={FineaseRoute.DASHBOARD} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'dashboard' ? 'active' : ''}`} >Dashboard</Link>
                    <Link to={FineaseRoute.RECHARGE} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'recharge' ? 'active' : ''}`} >Recharge</Link>
                    <Link to={FineaseRoute.TRANSACTIONS + '?page=1'} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'transactions' ? 'active' : ''}`}>Transactions</Link>
                    <Link to={FineaseRoute.PROFILE} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'profile' ? 'active' : ''}`}>Profile</Link>
                    <Link to={FineaseRoute.SETTINGS} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'settings' ? 'active' : ''}`} >Settings</Link>
                    {user.isAdmin && <Link to={FineaseRoute.ADMIN_AREA} className={`list-group-item list-group-item-action list-group-item-dark ${location === 'admin' ? 'active' : ''}`}>Admin Area</Link>}
                    <Link to={FineaseRoute.LOGOUT} className="btn btn-danger mt-2">Logout</Link>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;