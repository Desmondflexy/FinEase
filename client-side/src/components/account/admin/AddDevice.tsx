import { useForm } from "react-hook-form";
import { Operator } from "../../../utils/types";
import { useEffect, useState } from "react";
import { apiService } from "../../../api.service";
import { toast } from "react-toastify";
import { toastError } from "../../../utils/helpers";

type DataInputs = {
    deviceType: string;
    operatorId: string;
    fullName: string;
    address: string;
}

export default function AddDevice() {
    const [deviceType, setDeviceType] = useState('');

    return (
        <div id="add-device">
            <h3>Add Device</h3>
            <form className="mb-4">
                <label htmlFor="device-type">What device do you want to add?</label>
                <select id="device-type" onChange={e => setDeviceType(e.target.value)}>
                    <option value='' >--select--</option>
                    <option value="meter">Electricity Meter</option>
                    <option value="decoder">Cable Decoder</option>
                </select>
            </form>

            {deviceType === 'meter' && <RegisterMeterForm />}
            {deviceType === 'decoder' && <RegisterDecoderForm />}
        </div>
    )
}

function RegisterMeterForm() {
    type State = {
        discos: Operator[];
        loading: boolean;
    }
    const [state, setState] = useState<State>({
        discos: [],
        loading: false,
    });
    useEffect(fetchDiscos, []);
    const { discos, loading } = state;
    const { register, handleSubmit, watch, reset } = useForm<DataInputs>();
    const operatorId = watch('operatorId');

    const discoOptions = discos.map(disco => {
        return <option key={disco.id} value={disco.id}>{disco.desc}</option>
    });

    function onSubmit(data: DataInputs) {
        setState(s => ({ ...s, loading: true }));
        apiService.registerDevice(data).then(res => {
            toast.success(res.data.message);
            reset();
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setState(s => ({ ...s, loading: false }));
        });
    }

    function fetchDiscos() {
        setState(s => ({ ...s, loading: true }));
        apiService.getDiscos()
            .then(res => {
                setState(s => ({ ...s, discos: res.data.discos }));
            })
            .catch(err => {
                toastError(err, toast);
            }).finally(() => {
                setState(s => ({ ...s, loading: false }));
            })
    }
    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group mb-3">
                <div className="form-floating">
                    <select {...register('operatorId')} className="form-control" id="disco" required>
                        <option value=""> -- SELECT DISCO -- </option>
                        {discoOptions}
                    </select>
                    <label htmlFor="disco">Disco</label>
                </div>
            </div>
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input {...register('fullName')} disabled={!operatorId} className="form-control" id="customer-name" placeholder="Enter customer name" required />
                    <label htmlFor="customer-name">Customer Name</label>
                </div>
            </div>
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input {...register('address')} disabled={!operatorId} className="form-control" id="customer-address" placeholder="Enter customer address" required />
                    <label htmlFor="customer-address">Customer Address</label>
                </div>
            </div>

            <button className="w-100 btn btn-primary" disabled={loading} >Submit</button>
        </form>
    )
}

function RegisterDecoderForm() {
    return (
        <form>
            Coming soon...
        </form>
    )
}