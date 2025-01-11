import { useEffect, useState } from "react";
import { apiService } from "../../../api.service";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";

export function AdminExtras() {
    const [orm, setOrm] = useState("");
    useEffect(getActiveOrm, []);

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
            <p style={{ color: "red" }}>Coming soon...</p>
        </div>
    )
}