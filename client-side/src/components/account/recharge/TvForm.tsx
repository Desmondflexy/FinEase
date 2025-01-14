import { useForm } from "react-hook-form";
import { apiService } from "../../../api.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastError } from "../../../utils/helpers";
import { useUser } from "../../../utils/hooks";

export default function Tv() {
    const { register, handleSubmit, watch, reset } = useForm<InputData>();
    const [state, setState] = useState({
        operators: [] as Operator[],
        products: [] as CableTvPlan[],
        error: false,
    });
    const { user, setUser } = useUser();

    // const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [isLoading, setIsLoading] = useState({
        products: true,
        customer: false,
        submit: false,
    });
    const [feedbackText, setFeedbackText] = useState({
        products: 'Fetching cable tv operators...',
        customer: '',
        submit: 'Proceed',
    });
    // const x = 1;

    const operatorId = watch('operatorId');

    useEffect(fetchCableOperators, []);
    useEffect(fetchTvPlans, [operatorId]);

    const tvOptions = state.operators.map(operator => {
        return <option key={operator.id} value={operator.id}>{operator.name}</option>
    });

    const tvPlanOptions = state.products.map(plan => {
        return <option key={plan.id} value={plan.id}>{plan.name} - ₦{plan.meta.fee}</option>
    });

    function confirmUser() {

    }

    function onSubmit(data: InputData) {
        setIsLoading(s => ({ ...s, submit: true }));
        setFeedbackText(s => ({ ...s, submit: 'Processing...' }));
        const { operatorId, smartCardNumber, productId } = data;
        apiService.payCableTv(operatorId, smartCardNumber, productId).then(res => {
            toast.success(res.data.message);
            reset();
            setUser({ ...user, balance: res.data.balance });
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
            setIsLoading(s => ({ ...s, submit: false }));
            setFeedbackText(s => ({ ...s, submit: 'Proceed' }));
        })
    }

    function fetchTvPlans() {
        if (operatorId) {
            setState(s => ({ ...s, products: [] }));
            setIsLoading(s => ({ ...s, products: true }));
            setFeedbackText(s => ({ ...s, products: 'Fetching tv plans...' }));
            apiService.getOperatorTvPlans(operatorId).then(res => {
                setState(s => ({ ...s, products: res.data.products }));
                setFeedbackText(s => ({ ...s, products: '' }));
            }).catch(err => {
                toastError(toast, err);
                setFeedbackText(s => ({ ...s, products: 'Service unavailable. Please try again later.' }));
            }).finally(() => {
                setIsLoading(s => ({ ...s, products: false }));
            });
        }
    }

    function fetchCableOperators() {
        setFeedbackText(s => ({ ...s, products: 'Fetching cable tv operators...' }));
        apiService.getTvOperators().then(res => {
            setState(s => ({ ...s, operators: res.data.operators }));
        }).catch(err => {
            console.log(err.response.data);
        }).finally(() => {
            setFeedbackText(s => ({ ...s, products: '' }));
        });
    }

    return (
        <div id="tv-recharge">
            <h2>Cable Tv</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <select {...register('operatorId')} className="form-control" id="tv" required>
                            <option value=""> -- SELECT CABLE TV -- </option>
                            {tvOptions}
                        </select>
                        <label htmlFor="tv">Cable Tv</label>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <select {...register('productId')} className="form-control" id="tv-plan" required >
                            <option value="">-- SELECT PLAN --</option>
                            {tvPlanOptions}
                        </select>
                        <label htmlFor="tv-plan">Tv Plan</label>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <div className="form-floating">
                        <input {...register('smartCardNumber')} className="form-control" type="number" id="iuc-number" placeholder="Enter smart card number" required onBlur={confirmUser} />
                        <label htmlFor="iuc-number">IUC Number</label>
                    </div>
                </div>
                <button disabled={isLoading.submit} className="btn btn-warning w-100">{feedbackText.submit}</button>
            </form>
            {<i className="text-danger">{feedbackText.products}</i>}

            {/* {true &&
                <div className="details">
                    <div className="my-4 bg-info-subtle">
                        {feedbackText.customer && <i className={`text-${x === 1 ? 'danger' : 'primary'}`}>{feedbackText.customer}</i>}
                        {customer && (
                            <div>
                                <p>Name: {customer.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            } */}
        </div>
    )
}

type InputData = {
    operatorId: string;
    productId: string;
    smartCardNumber: string;
}