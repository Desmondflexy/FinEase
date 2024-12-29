import DataForm from "./DataForm";
import ElectricityForm from "./ElectricityForm";
import Tv from "./TvForm";
import AirtimeForm from "./AirtimeForm";
import { useNavigate, Route, Routes, useLocation } from "react-router-dom";

export default function Recharge() {
    const navigate = useNavigate();
    const paths = useLocation().pathname.split('/');
    const location = paths[paths.length - 1];

    return (
        <section id="recharge">
            <h1>Recharge</h1>
            <form className="mb-4">
                <label htmlFor="service">What do you want to do?</label>
                <select id="service" value={location} onChange={e => navigate(e.target.value)}>
                    <option value='' >--select--</option>
                    <option value="airtime">Buy Airtime</option>
                    <option value="data">Buy Data</option>
                    <option value="electricity">Buy Electricity</option>
                    <option value="tv">Tv Subscription</option>
                </select>
            </form>
            <Outlet />
        </section>
    );
}

function Outlet() {
    return (
        <Routes>
            <Route path='airtime' element={<AirtimeForm />} />
            <Route path='data' element={<DataForm />} />
            <Route path='electricity' element={<ElectricityForm />} />
            <Route path='tv' element={<Tv />} />
        </Routes>
    );
}