import { useEffect, useState } from "react";
import { networkLogo, phoneNumberRegex } from "../../../utils/constants";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { toastError } from "../../../utils/helpers";
import { apiService } from "../../../api.service";
import { useUserHook } from "../../../utils/hooks";

export default function DataForm() {
    const { user, setUser } = useUserHook();
    const [state, setState] = useState<IState>({
        networks: [],
        plans: [],
        processing: false,
        logoUrl: '',
        errorFeedback: 'Fetching networks...',
    });

    const { register, handleSubmit, watch, reset } = useForm<DataInputs>();
    const phone = watch('phone');
    const operatorId = watch('operatorId');

    const networkOptions = state.networks.map(network => {
        return <option key={network.id} value={network.id}>{network.name}</option>
    });

    const planOptions = state.plans.map(plan => {
        return <option key={plan.id} value={plan.id}>{plan.name}</option>
    });

    useEffect(fetchNetworks, []);
    useEffect(fetchDataPlans, [operatorId]);

    function fetchNetworks() {
        apiService.getNetworks().then(res => {
            const { networks } = res.data
            setState(s => ({ ...s, networks, errorFeedback: '' }));
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, errorFeedback: 'Service unavailable. Please try again later.' }));
        });
    }

    function fetchDataPlans() {
        if (operatorId)
            apiService.getOperatorDataPlans(operatorId).then(res => {
                setState(s => ({ ...s, plans: res.data.dataPlans }));
            }).catch(err => {
                toastError(err, toast);
                setState(s => ({ ...s, plans: [] }));
            })
    }

    function determineNetwork() {
        if (!phone) return;
        if (!phoneNumberRegex.test(phone)) {
            setState(s => ({ ...s, logoUrl: '' }));
            toastError(new Error("Invalid phone number"), toast, true);
            return;
        }
        apiService.getMobileNetwork(phone).then(res => {
            const network = res.data.network.toLowerCase() as string;
            setState(s => ({ ...s, logoUrl: networkLogo[network] }));
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, logoUrl: '' }));
        });
    }

    function buyData(operatorId: string, dataPlanId: string, phone: string) {
        apiService.buyData(operatorId, dataPlanId, phone).then(res => {
            const { message, balance } = res.data;
            toast.success(message);
            setState(s => ({ ...s, processing: false, logoUrl: '' }));
            setUser({ ...user, balance });
            reset();
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, processing: false }));
        });
    }

    function onSubmit(data: DataInputs) {
        const { operatorId, dataPlanId, phone } = data;
        setState(s => ({ ...s, processing: true }));
        buyData(operatorId, dataPlanId, phone);
        document.querySelector('button')?.focus();
    }

    return (
        <div>
            <h2>Data</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <select {...register('operatorId')} className="form-control" required id="network">
                            <option value="">-- SELECT NETWORK --</option>
                            {networkOptions}
                        </select>
                        <label htmlFor="network">Network</label>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <select {...register('dataPlanId')} className="form-control" id="data-plan" required disabled={!operatorId} >
                            <option value="">-- SELECT DATAPLANS --</option>
                            {planOptions}
                        </select>
                        <label htmlFor="data-plan">Data Plan</label>
                    </div>

                </div>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input {...register('phone')} className="form-control" type="tel" maxLength={11} required id="phone" placeholder="Phone Number" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
                        <label htmlFor="phone">Phone Number</label>
                    </div>
                    {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} style={{ width: '40px' }} />}
                </div>
                <button className="w-100 btn btn-primary" disabled={state.processing}>{state.processing ? 'Transaction processing! Please wait...' : 'Proceed'}</button>
            </form>
            {state.errorFeedback && <i className="text-danger">{state.errorFeedback}</i>}
        </div>
    );
}

type IState = {
    networks: {
        id: string;
        name: string;
    }[];
    plans: {
        amount: number;
        id: string;
        name: string;
    }[];
    processing: boolean;
    logoUrl: string;
    errorFeedback: string;
}

type DataInputs = {
    operatorId: string;
    dataPlanId: string;
    phone: string;
}

// 164 lines of code reduced to 141 lines!