import { useEffect, useState } from "react";
import { Operator } from "../../../utils/types";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { toastError } from "../../../utils/helpers";
import { apiService } from "../../../api.service";
import { useUserHook } from "../../../utils/hooks";

function ElectricityForm() {
    const [state, setState] = useState({
        token: '',
        units: 0,
        discos: [] as Operator[],
        error: false,
    });
    const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [isLoading, setIsLoading] = useState({
        discos: true,
        customer: false,
        submit: false,
    });
    const [feedbackText, setFeedbackText] = useState({
        discos: 'Fetching discos...',
        customer: '',
        submit: 'Proceed',
    });

    const { token, units, discos, error } = state;

    const { user, setUser } = useUserHook();
    const { register, handleSubmit, watch, reset, setValue } = useForm<DataInputs>();
    const operatorId = watch('operatorId');
    const meterNumber = watch('meterNumber');
    const discoInfo = discos.find(disco => disco.id === operatorId)?.desc || '';

    const discoOptions = discos.map((disco: Operator) => {
        return <option key={disco.id} value={disco.id}>{disco.name}</option>
    });

    useEffect(() => {
        setState(s => ({ ...s, error: false }));
        setFeedbackText(s => ({ ...s, customer: '' }));
    }, [meterNumber]);

    useEffect(fetchDiscos, []);

    useEffect(() => {
        setValue('meterType', '');
        setValue('meterNumber', '');
        setCustomer(null);
        setFeedbackText(s => ({ ...s, customer: '' }));
        setState(s => ({ ...s, error: false }));
    }, [operatorId, setValue]);

    function fetchDiscos() {
        apiService.getDiscos().then(res => {
            setState(s => ({ ...s, discos: res.data.operators }));
            setFeedbackText(s => ({ ...s, discos: '' }));
        }).catch(() => {
            setState(s => ({ ...s, error: true }));
            setFeedbackText(s => ({ ...s, discos: 'Service unavailable. Please try again later.' }));
        }).finally(() => {
            setIsLoading(s => ({ ...s, discos: false }));
        })
    }

    function confirmUser() {
        if (!meterNumber) {
            setState(s => ({ ...s, error: true }));
            setFeedbackText(s => ({ ...s, customer: 'Meter number is required!' }));
            return;
        }
        setIsLoading(s => ({ ...s, customer: true }));
        setFeedbackText(s => ({ ...s, customer: 'Validating customer info. Please wait...' }));
        setState(s => ({ ...s, error: false }));
        apiService.validateMeter(operatorId, meterNumber).then(res => {
            setCustomer(res.data.customer);
            setFeedbackText(s => ({ ...s, customer: '' }));
        }).catch((err) => {
            setState(s => ({ ...s, error: true }));
            setFeedbackText(s => ({ ...s, customer: err.response.data.message }));
        }).finally(() => {
            setIsLoading(s => ({ ...s, customer: false }));
        })
    }

    function buyElectricity(amount: string, operatorId: string, meterType: string, meterNumber: string) {
        apiService.buyElectricity(operatorId, amount, meterNumber, meterType).then((res) => {
            const { message, units, token } = res.data;
            toast.success(message);
            setState(s => ({ ...s, token, units }));
            setUser({ ...user, balance: res.data.balance });
            reset();
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setIsLoading(s => ({ ...s, submit: false }));
            setFeedbackText(s => ({ ...s, submit: 'Proceed' }));
        })
    }

    function onSubmit(data: DataInputs) {
        const { amount, meterNumber, meterType, operatorId } = data;
        setIsLoading(s => ({ ...s, submit: true }));
        setFeedbackText(s => ({ ...s, submit: 'Transaction processing! Please wait...' }));
        buyElectricity(amount, operatorId, meterType, meterNumber);
        document.querySelector('button')?.focus();
    }

    const processing = isLoading.discos || isLoading.customer || isLoading.submit;
    return (
        <div id="electricity-recharge">
            <h2>Electricity</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className={`${token ? '' : 'hidden'} alert alert-success alert-dismissible fade show`} role="alert">
                    <strong>Transaction successful.</strong> Electricity token: {token}. Units: {units}.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
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
                        <select {...register('meterType')} className="form-control" id="meter-type" required>
                            <option value=""> -- SELECT METER TYPE -- </option>
                            <option value="prepaid">Prepaid</option>
                            <option value="postpaid">Postpaid</option>
                        </select>
                        <label htmlFor="meter-type">Meter Type</label>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input {...register('meterNumber')} disabled={!operatorId} className="form-control" type="number" id="meter-number" placeholder="Enter customer meter number" required onBlur={confirmUser} />
                        <label htmlFor="meter-number">Meter Number</label>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input {...register('amount')} className="form-control" type="number" id="amount" placeholder="Enter amount in Naira" required />
                        <label htmlFor="amount">Amount</label>
                    </div>
                </div>
                <button className="btn btn-danger w-100" disabled={processing || error}>{feedbackText.submit}</button>
            </form>
            {<i className="text-danger">{feedbackText.discos}</i>}

            {discoInfo &&
                <div className="details">
                    <div className="my-4 bg-info-subtle">
                        <p>{discoInfo}</p>
                        {feedbackText.customer && <i className={`text-${error ? 'danger' : 'primary'}`}>{feedbackText.customer}</i>}
                        {customer && (
                            <div>
                                <p>Name: {customer.name}</p>
                                <p>Address: {customer.address}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
}

export default ElectricityForm;


type DataInputs = {
    operatorId: string;
    meterType: string;
    meterNumber: string;
    amount: string;
}

type ICustomer = {
    name: string;
    address: string;
};