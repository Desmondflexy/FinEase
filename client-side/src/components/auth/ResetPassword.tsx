import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastError } from "../../utils/helpers";
import { apiService } from "../../api.service";
import { FineaseRoute } from "../../utils/constants";

export function ResetPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm<DataType>();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'FinEase - Reset Password';
    }, []);

    const urlParams = useParams();
    const resetId = urlParams.resetId as string;
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") as string;

    function onSubmit(data: DataType) {
        setIsSubmitting(true);
        const { password, confirm } = data;
        apiService.resetPassword(resetId, email, password, confirm).then(res => {
            navigate(FineaseRoute.LOGIN);
            toast.success(res.data.message);
        }).catch((err) => {
            toastError(err, toast);
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
                <input {...register('password')} className="form-control" id="password" type="password" placeholder="New Password" required />
                <label htmlFor="password">New Password</label>
            </div>
            <div className="form-floating mb-3">
                <input {...register('confirm')} className="form-control" id="confirm" type="password" placeholder="Confirm New Password" required />
                <label htmlFor="confirm">Confirm New Password</label>
            </div>
            <div>
                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Submitting... Please wait</span>
                    </> : "Submit"}
                </button>
            </div>
        </form>
    );
}

type DataType = {
    password: string;
    confirm: string;
}