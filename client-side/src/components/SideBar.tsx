import { NavLink } from "react-router-dom";
import { FineaseRoute } from "../utils/constants";
import { useUser } from "../utils/hooks";

function SideBar() {
    const { user } = useUser();

    function handleLinkClick() {
        const offcanvasElement = document.getElementById("offcanvasWithBothOptions");
        if (offcanvasElement) {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
            offcanvasInstance?.hide(); // Close the sidebar
        }
    }

    const makeNavLink = (to: string, text: string) => {
        const inactive = "list-group-item list-group-item-action list-group-item-dark";
        const active = `${inactive} active`;

        return (
            <NavLink to={to} className={({ isActive }) => isActive ? active : inactive} onClick={handleLinkClick} >
                {text}
            </NavLink>
        );
    };

    return (
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">{user.fullName}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group list-group-flush m-0">
                    {makeNavLink(FineaseRoute.DASHBOARD, 'Dashboard')}
                    {makeNavLink(FineaseRoute.RECHARGE, 'Recharge')}
                    {makeNavLink(FineaseRoute.RECEIPTS, 'Receipts')}
                    {makeNavLink(FineaseRoute.TRANSACTIONS, 'Transactions')}
                    {makeNavLink(FineaseRoute.PROFILE, 'Profile')}
                    {makeNavLink(FineaseRoute.SETTINGS, 'Settings')}
                    {makeNavLink(FineaseRoute.FEATURES, 'Features')}
                    {user.isAdmin && makeNavLink(FineaseRoute.ADMIN_AREA, 'Admin Area')}
                    <NavLink to={FineaseRoute.LOGOUT} className="btn btn-danger mt-2">Logout</NavLink>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;