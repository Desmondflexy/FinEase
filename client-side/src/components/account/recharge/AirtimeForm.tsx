import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { networkLogo, phoneNumberRegex } from "../../../utils/constants";
import { useForm } from "react-hook-form";
import { toastError } from "../../../utils/helpers";
import { apiService } from "../../../api.service";
import { useUserHook } from "../../../utils/hooks";

function AirtimeForm() {
    const [state, setState] = useState<IState>({
        networks: [],
        processing: false,
        logoUrl: '',
        errorFeedback: 'Fetching networks...',
    });
    const {user, setUser} = useUserHook()
    const { register, reset, watch, handleSubmit } = useForm<DataInputs>();
    const networkOptions = state.networks.map(network => {
        return <option key={network.id} value={network.id}>{network.name}</option>
    });

    useEffect(fetchNetworks, []);

    const phone = watch('phone');

    function fetchNetworks() {
        apiService.getNetworks().then(res => {
            const { networks } = res.data
            setState(s => ({ ...s, networks, errorFeedback: '' }));
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, errorFeedback: 'Service unavailable. Please try again later.' }));
        });
    }

    function buyAirtime(operatorId: string, amount: string, phone: string) {
        apiService.buyAirtime(operatorId, amount, phone).then(res => {
            const { message } = res.data;
            toast.success(message);
            setState(s => ({ ...s, processing: false, logoUrl: '' }));
            setUser(user);
            reset();
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, processing: false }));
        });
    }

    function determineNetwork() {
        if (!phone) return;
        if (!phoneNumberRegex.test(phone)) {
            setState(s => ({ ...s, logoUrl: '' }));
            toastError(new Error("Invalid phone number"), toast, true);
            return;
        }
        apiService.getMobileNetwork(phone).then(res => {
            const network = res.data.network.toLowerCase();
            setState(s => ({ ...s, logoUrl: networkLogo[network] }));
        }).catch(err => {
            toastError(err, toast);
            setState(s => ({ ...s, logoUrl: '' }));
        });
    }

    function onSubmit(data: DataInputs) {
        const { operatorId, amount, phone } = data;
        setState(s => ({ ...s, processing: true }));
        buyAirtime(operatorId, amount, phone);
        document.querySelector('button')?.focus();
    }

    return (
        <div>
            <h2>Airtime</h2>
            <form onBlur={determineNetwork} className="form" onSubmit={handleSubmit(onSubmit)}>
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
                        <input {...register('phone')} className="form-control" type="tel" maxLength={11} required id="phone" placeholder="Phone Number" pattern={phoneNumberRegex.source} />
                        <label htmlFor="phone">Phone Number</label>
                    </div>
                    {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} style={{ width: '40px' }} />}
                </div>

                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input {...register('amount')} className="form-control" min={1} required autoComplete="off" type="number" id="amount" placeholder="50" />
                        <label htmlFor="amount">Amount</label>
                    </div>
                </div>
                <button className="w-100 btn btn-success" disabled={state.processing}>{state.processing ? 'Transaction processing! Please wait...' : 'Proceed'}</button>
            </form>
            {state.errorFeedback && <i className="text-danger">{state.errorFeedback}</i>}
        </div>
    );
}

export default AirtimeForm;

type IState = {
    networks: {
        id: string;
        name: string;
    }[];
    processing: boolean;
    logoUrl: string;
    errorFeedback: string;
}

type DataInputs = {
    operatorId: string;
    phone: string;
    amount: string;
}

// 133 lines of code reduced to 116 lines!