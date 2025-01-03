import { useForm } from "react-hook-form";
import { apiService } from "../../../api.service";
import { useEffect, useState } from "react";
import { CableTvPlan, Operator } from "../../../utils/types";
import { toast } from "react-toastify";
import { toastError } from "../../../utils/helpers";
import { useUserHook } from "../../../utils/hooks";

export default function Tv() {
    const { register, handleSubmit, watch, reset } = useForm<InputData>();
    const [state, setState] = useState({
        operators: [] as Operator[],
        products: [] as CableTvPlan[],
    });
    const { user, setUser } = useUserHook();

        // const [customer, setCustomer] = useState<ICustomer | null>(null);
        // const [isLoading, setIsLoading] = useState({
        //     products: true,
        //     customer: false,
        //     submit: false,
        // });
        // const [feedbackText, setFeedbackText] = useState({
        //     products: 'Fetching products...',
        //     customer: '',
        //     submit: 'Proceed',
        // });

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
        const { operatorId, smartCardNumber, productId } = data;
        apiService.payCableTv(operatorId, smartCardNumber, productId).then(res => {
            toast.success(res.data.message);
            reset();
            setUser({ ...user, balance: res.data.balance });
        }).catch(err => {
            toastError(err, toast);
        }).finally(() => {
        })
    }

    function fetchTvPlans() {
        setState(s => ({ ...s, products: [] }));
        if (operatorId)
            apiService.getOperatorTvPlans(operatorId).then(res => {
                setState(s => ({ ...s, products: res.data.products }));
            }).catch(err => {
                console.log(err.response.data);
            });
    }

    function fetchCableOperators() {
        apiService.getTvOperators().then(res => {
            setState(s => ({ ...s, operators: res.data.operators }));
        }).catch(err => {
            console.log(err.response.data);
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
                <button className="btn btn-warning w-100">submit</button>
            </form>

            {/* {true &&
                <div className="details">
                    <div className="my-4 bg-info-subtle">
                        {feedbackText.customer && <i className={`text-${true ? 'danger' : 'primary'}`}>{feedbackText.customer}</i>}
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