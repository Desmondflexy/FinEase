import { useEffect, useState } from "react";
import { apiService } from "../../../api.service";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";

export function AdminExtras() {
    const [orm, setOrm] = useState("");
    const [mockApiEnabled, setMockApiEnabled] = useState(true);
    useEffect(getActiveOrm, []);

    function handleMockApiChange(){
        setMockApiEnabled(!mockApiEnabled);
    }

    function getActiveOrm() {
        apiService.getAppInfo().then(res => {
            setOrm(res.data.orm);
        }).catch(err => {
            toastError(err, toast);
        });
    }

    return (
        <div>
            <h3>Extras</h3>
            <li>Active ORM: {orm}</li>
            <li>Other settings</li>
            <li>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={mockApiEnabled} onChange={handleMockApiChange} />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable Mock Api</label>
                </div>
            </li>
            <p style={{ color: "red" }}>Coming soon...</p>
        </div>
    )
}