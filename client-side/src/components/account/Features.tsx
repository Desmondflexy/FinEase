import { Link, Route, Routes } from "react-router-dom";
import { FineaseRoute } from "../../utils/constants";
import { getRoutePath } from "../../utils/helpers";
import AppError from "../AppError";
import AddDevice from "./admin/AddDevice";

export default function Features() {
    return (
        <section id="features">
             <ul className="nav">
                <li><Link to={FineaseRoute.ADD_DEVICE_FEATURES}>Add Device</Link></li>
            </ul>

            <Outlet />
        </section>
    )
}


function Outlet() {
    return (
        <Routes>
            <Route index element={<h3>do the stuff you like</h3>} />
            <Route path={getRoutePath(FineaseRoute.ADD_DEVICE_FEATURES)} element={<AddDevice isAdmin={false} />} />
            <Route path='*' element={<AppError message={'Page Not Found'} code={404} goto={''} />} />
        </Routes>
    );
}