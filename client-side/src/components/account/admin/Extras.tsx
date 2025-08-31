import { useEffect, useState } from "react";
import { apiService } from "../../../api.service";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FineaseRoute } from "../../../utils/constants";

export function AdminExtras() {
    const [orm, setOrm] = useState("");
    const [mockApiEnabled, setMockApiEnabled] = useState(true);
    useEffect(getActiveOrm, []);

    function handleMockApiChange() {
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
            <li><Link to={FineaseRoute.PASSWORD_COMPLEXITY}>Password Complexity Settings</Link></li>
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


interface PolicyItem {
    id: number;
    description: string;
    settingKey: string;
    value: string;
}


export function PasswordComplexity() {
    const [policies, setPolicies] = useState<PolicyItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(fetchPolicies, []);

    function fetchPolicies() {
        apiService.getPasswordPolicies()
            .then(res => setPolicies(res.data))
            .catch(err => console.error('Failed to load policies', err));
    }

    const handleChange = (index: number, newValue: string) => {
        const updated = [...policies];
        updated[index].value = newValue;
        setPolicies(updated);
    };

    function saveSetting(id:number, value:string) {
        setIsSaving(true);
        apiService.updatePasswordPolicy(id, value)
            .then(res => {
                if (res.status === 200) toast.success("Saved!")
            })
            .catch(err => {
                toastError(err, toast);
            })
            .finally(() => setIsSaving(false));
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Password Policy Settings</h2>
            {policies.map((policy, index) => (
                <div key={policy.id} className="card mb-3">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">{policy.description}</label>
                                {policy.value === 'true' || policy.value === 'false' ? (
                                    <select
                                        className="form-select"
                                        value={policy.value}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={policy.value}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="col-md-3 mt-3 mt-md-0">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() => saveSetting(policy.id, policy.value)}
                                    disabled={isSaving}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}