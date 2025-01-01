import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { apiService } from "../../../api.service";
import Loading from "../../Loading";
import { formatDateTime, toastError } from "../../../utils/helpers";
import { toast } from "react-toastify";

export default function DeviceInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [device, setDevice] = useState<Device | null>(null);

    useEffect(getDeviceInfo, [id, navigate]);

    function getDeviceInfo() {
        setLoading(true);
        apiService.getDevice<{ device: Device }>(id as string).then(res => {
            setDevice(res.data.device);
        }).catch(err => {
            toastError(err, toast);
            navigate('/account/admin/devices');
        }).finally(() => setLoading(false));
    }

    if (loading)
        return <Loading />;

    if (device)
        return (
            <div id="device-info">
                <h3>Device Details</h3>
                <hr />
                <div>
                    <p><b>Customer Name: </b><i>{device.fullName}</i></p>
                    <p><b>Customer Email: </b><i>{device.email}</i></p>
                    <p><b>Customer Phone: </b><i>{device.phone}</i></p>
                    <p><b>Address: </b><i>{device.address}</i></p>
                    <p><b>Device Number: </b><i>{device.deviceNumber}</i></p>
                    <p><b>Operator: </b><i>{device.operator.desc}</i></p>
                    <p><b>Sector: </b><i>{device.operator.sector}</i></p>
                    <p><b>Date Created: </b><i>{formatDateTime(device.createdAt)}</i></p>
                </div>
            </div>
        );

    return <div>Device not found</div>
}

type Device = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    deviceNumber: string;
    createdAt: string;
    operator: {
        id: string;
        name: string;
        desc: string;
        sector: string;
    }
}