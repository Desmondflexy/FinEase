import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { apiService } from "../../../api.service";
import { toast } from "react-toastify";
import { toastError } from "../../../utils/helpers";

type DataInputs = {
    operatorId: string;
    fullName: string;
    address: string;
    phone: string;
}

export default function AddDevice({ isAdmin }: { isAdmin: boolean }) {
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

            {deviceType === 'meter' && <RegisterMeterForm isAdmin={isAdmin} />}
            {deviceType === 'decoder' && <RegisterDecoderForm isAdmin={isAdmin} />}
        </div>
    )
}

function RegisterMeterForm({ isAdmin }: { isAdmin: boolean }) {
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

    function onSubmitAdmin(data: DataInputs) {
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

    function onSubmitUser(data: DataInputs) {
        setState(s => ({ ...s, loading: true }));
        apiService.requestDeviceApproval(data).then(res => {
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
                setState(s => ({ ...s, discos: res.data.operators }));
            })
            .catch(err => {
                toastError(err, toast);
            }).finally(() => {
                setState(s => ({ ...s, loading: false }));
            })
    }

    return (
        <form className="form" onSubmit={handleSubmit(isAdmin? onSubmitAdmin: onSubmitUser)}>
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

function RegisterDecoderForm({ isAdmin }: { isAdmin: boolean }) {
    type State = {
        operators: Operator[];
        loading: boolean;
    }
    const [state, setState] = useState<State>({
        operators: [],
        loading: false,
    });
    useEffect(fetchCableOperators, []);
    const { operators, loading } = state;
    const { register, handleSubmit, watch, reset } = useForm<DataInputs>();
    const operatorId = watch('operatorId');

    const cableOptions = operators.map(disco => {
        return <option key={disco.id} value={disco.id}>{disco.desc}</option>
    });

    function onSubmitAdmin(data: DataInputs) {
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

    function onSubmitUser(data: DataInputs) {
        setState(s => ({ ...s, loading: true }));
        apiService.requestDeviceApproval(data).then(res => {
            toast.success(res.data.message);
            reset();
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setState(s => ({ ...s, loading: false }));
        });
    }

    function fetchCableOperators() {
        setState(s => ({ ...s, loading: true }));
        apiService.getTvOperators()
            .then(res => {
                setState(s => ({ ...s, operators: res.data.operators }));
            })
            .catch(err => {
                toastError(err, toast);
            }).finally(() => {
                setState(s => ({ ...s, loading: false }));
            })
    }
    return (
        <form className="form" onSubmit={handleSubmit(isAdmin? onSubmitAdmin: onSubmitUser)}>
            <div className="input-group mb-3">
                <div className="form-floating">
                    <select {...register('operatorId')} className="form-control" id="cable-tv" required>
                        <option value=""> -- SELECT CABLE TV -- </option>
                        {cableOptions}
                    </select>
                    <label htmlFor="cable-tv">Cable Tv</label>
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
                    <input {...register('phone')} disabled={!operatorId} className="form-control" id="customer-phone" placeholder="Enter customer phone number" />
                    <label htmlFor="customer-phnoe">Customer Phone Number</label>
                </div>
            </div>

            <button className="w-100 btn btn-success" disabled={loading} >Submit</button>
        </form>
    )
}