import { useState, useEffect } from "react";
import { ApiStatus } from "../../../utils/types";
import AppError from "../../AppError";
import { apiService } from "../../../api.service";
import Loading from "../../Loading";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FineaseRoute } from "../../../utils/constants";

export default function UsersList() {
    const [state, setState] = useState<IState>({
        devices: [],
        apiStatus: ApiStatus.LOADING,
        error: { status: 0, statusText: '', goto: '/' },
        fetchingData: false,
    });

    const { register, } = useForm<{ search: string }>();

    const { apiStatus, error, devices } = state;

    useEffect(() => {
        apiService.getDevices()
            .then(res => {
                const { devices } = res.data;

                setState(s => ({
                    ...s,
                    devices,
                    apiStatus: ApiStatus.SUCCESS,
                    fetchingData: false,
                }));
            }).catch(err => {
                setState(s => ({ ...s, apiStatus: ApiStatus.ERROR }));
                toastError(err, toast);
                if (err.response) {
                    const { status, statusText } = err.response;
                    setState(s => ({
                        ...s,
                        error: {
                            ...s.error,
                            status,
                            statusText,
                            goto: status >= 401 && status <= 499 ? FineaseRoute.LOGIN : s.error.goto
                        }
                    }));
                } else {
                    setState(s => ({ ...s, error: { ...s.error, status: 500, statusText: err.message } }));
                }
            });
    }, []);

    const navigate = useNavigate();

    if (apiStatus === ApiStatus.SUCCESS) {
        return (
            <div id="customer-devices">
                <h3>Customer Devices</h3>
                <input type="search" placeholder="Search for device" {...register("search")} />
                <hr />
                <div className="pg-size">
                    <label htmlFor="pg-size">Size: </label>
                    <select name="pg-size" id="pg-size">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th><span>Device Number</span></th>
                                <th><span>Customer Name</span></th>
                                <th><span>Customer Address</span></th>
                                <th><span>Date Added</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device, index) => (
                                <tr key={device.id} className="naked-btn" onClick={() => navigate(`${FineaseRoute.DEVICES}/${device.id}`)}>
                                    <td>{index + 1}</td>
                                    <td>{device.deviceNumber}</td>
                                    <td>{device.fullName}</td>
                                    <td>{device.address}</td>
                                    <td>{device.createdAt.split('T')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (apiStatus === ApiStatus.ERROR) {
        return <AppError code={error.status} message={error.statusText} goto={error.goto} />
    }

    return <Loading />;
}

type IState = {
    devices: {
        id: string;
        fullName: string;
        address: string;
        deviceNumber: string;
        operator: string;
        operatorId: string;
        createdAt: string;
    }[];
    apiStatus: ApiStatus;
    error: {
        status: number;
        statusText: string;
        goto: string;
    },
    fetchingData: boolean;
}