import { Link, useLocation } from "react-router-dom";
import { FineaseRoute } from "../utils/constants";
import { useUser } from "../utils/hooks";

function SideBar() {
    const location = useLocation().pathname.split('/')[2];
    const { user } = useUser();

    const linkClassName = 'list-group-item list-group-item-action list-group-item-dark';

    return (
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">{user.fullName}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group list-group-flush m-0">
                    <Link to={FineaseRoute.DASHBOARD} className={`${linkClassName} ${location === 'dashboard' ? 'active' : ''}`} >Dashboard</Link>
                    <Link to={FineaseRoute.RECHARGE} className={`${linkClassName} ${location === 'recharge' ? 'active' : ''}`} >Recharge</Link>
                    <Link to={FineaseRoute.TRANSACTIONS + '?page=1'} className={`${linkClassName} ${location === 'transactions' ? 'active' : ''}`}>Transactions</Link>
                    <Link to={FineaseRoute.PROFILE} className={`${linkClassName} ${location === 'profile' ? 'active' : ''}`}>Profile</Link>
                    <Link to={FineaseRoute.SETTINGS} className={`${linkClassName} ${location === 'settings' ? 'active' : ''}`} >Settings</Link>
                    {
                        user.isAdmin &&
                        <Link to={FineaseRoute.ADMIN_AREA} className={`${linkClassName} ${location === 'admin' ? 'active' : ''}`}>Admin Area</Link>
                    }
                    <Link to={FineaseRoute.LOGOUT} className="btn btn-danger mt-2">Logout</Link>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;