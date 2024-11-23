import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../api.config";
import { toast } from "react-toastify";
import { handleError } from "../../../utils/utils";

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

    function onSubmit(data: DataType) {
        const { password, confirm } = data;
        function reset() {
            Api.post(`/auth/reset-password/${resetId}`, { password, confirm })
                .then((res) => {
                    console.log(res.data);
                    navigate("/auth/login");
                    toast.success("Password reset successful");
                    setState((s) => ({ ...s, loading: false }));
                })
                .catch((err) => {
                    if (err.response) {
                        handleError(err, toast);
                    } else {
                        toast.error(err.message);
                    }
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