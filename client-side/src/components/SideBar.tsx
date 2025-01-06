import { Link, useLocation } from "react-router-dom";
import { FineaseRoute } from "../utils/constants";
import { useUser } from "../utils/hooks";

function SideBar() {
    const location = useLocation().pathname.split('/')[2];
    const { user } = useUser();

    function getClassName(route: string) {
        const linkClassName = 'list-group-item list-group-item-action list-group-item-dark';
        const paths = route.split('/');
        const last = paths[paths.length - 1];
        return `${linkClassName} ${location === last ? 'active' : ''}`;
    }

    return (
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">{user.fullName}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group list-group-flush m-0">
                    <Link to={FineaseRoute.DASHBOARD} className={getClassName(FineaseRoute.DASHBOARD)} >Dashboard</Link>
                    <Link to={FineaseRoute.RECHARGE} className={getClassName(FineaseRoute.RECHARGE)} >Recharge</Link>
                    <Link to={FineaseRoute.RECEIPTS} className={getClassName(FineaseRoute.RECEIPTS)}>Receipts</Link>
                    <Link to={FineaseRoute.TRANSACTIONS + '?page=1'} className={getClassName(FineaseRoute.TRANSACTIONS)}>Transactions</Link>
                    <Link to={FineaseRoute.PROFILE} className={getClassName(FineaseRoute.PROFILE)}>Profile</Link>
                    <Link to={FineaseRoute.SETTINGS} className={getClassName(FineaseRoute.SETTINGS)} >Settings</Link>
                    <AdminAreaLink isAdmin={user.isAdmin} className={getClassName(FineaseRoute.ADMIN_AREA)} />
                    <Link to={FineaseRoute.FEATURES} className={getClassName(FineaseRoute.FEATURES)}>Features</Link>
                    <Link to={FineaseRoute.LOGOUT} className="btn btn-danger mt-2">Logout</Link>
                </ul>
            </div>
        </div>
    )
}

function AdminAreaLink({ isAdmin, className }: { isAdmin: boolean; className: string }) {
    if (!isAdmin) return null;
    return (
        <Link to={FineaseRoute.ADMIN_AREA} className={className}>Admin Area</Link>
    );
}

export default SideBar;