import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleError } from "../../../utils/helpers";
import { apiService } from "../../../api.service";

interface DataType {
    password: string;
    confirm: string;
}

export function ResetPassword() {
    const [state, setState] = useState({
        loading: false,
    });

    const { register, handleSubmit } = useForm<DataType>();

    const { loading } = state;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'FinEase - Reset Password';
    });

    const { resetId } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    function onSubmit(data: DataType) {
        const { password, confirm } = data;
        function reset() {
            apiService.resetPassword({ resetId, email, password, confirm })
                .then(() => {
                    navigate("/auth/login");
                    toast.success("Password reset successful");
                    setState((s) => ({ ...s, loading: false }));
                })
                .catch((err) => {
                    handleError(err, toast);
                    setState((s) => ({ ...s, loading: false }));
                });
        }

        setState((s) => ({ ...s, loading: true }));
        reset();
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
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Submitting... Please wait</span>
                    </> : "Submit"}
                </button>
            </div>
        </form>
    );
}