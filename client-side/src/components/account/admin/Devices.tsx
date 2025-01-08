import { useState, useEffect } from "react";
import { apiService } from "../../../api.service";
import { toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";

export default function UsersList() {
    const [data, setData] = useState({
        devices: [] as Device[],
        isLoading: true,
    });
    const { devices, isLoading } = data;

    useEffect(fetchDevices, []);

    function fetchDevices() {
        setData(s => ({ ...s, isLoading: true }));
        apiService.getDevices().then(res => {
            const { devices, meta, links } = res.data;
            setData(s => ({ ...s, devices, meta, links }));
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setData(s => ({ ...s, isLoading: false }));
        });
    }

    return (
        <div id="customer-devices">
            <h3>Customer Devices</h3>
            <hr />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th><span>Device Number</span></th>
                            <th><span>Operator Name</span></th>
                            <th><span>Operator Sector</span></th>
                            <th><span>Customer Name</span></th>
                            <th><span>Date Added</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={6}>Loading...</td></tr> :
                            devices.length === 0 ? <tr><td colSpan={6}>No devices found</td></tr> :
                                devices.map((device, index) => (
                                    <tr key={device.id}>
                                        <td>{index + 1}</td>
                                        <td>{device.deviceNumber}</td>
                                        <td>{device.operatorName}</td>
                                        <td>{device?.operatorSector}</td>
                                        <td>{device.fullName}</td>
                                        <td>{device.createdAt.split('T')[0]}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}