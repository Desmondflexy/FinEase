import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Api from '../api.config';
import { useEffect } from 'react';
import { handleError } from '../utils/utils';
export default function VerifyEmail() {
    const { verifyId } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const navigate = useNavigate();
    useEffect(() => {
        Api.patch(`/auth/email-verify/${verifyId}?email=${email}`)
            .then(res => {
                navigate('/auth/login');
                toast.success(res.data.message);
            })
            .catch(error => {
                navigate('/auth/login');
                handleError(error, toast);
            });
    });

    return null;
}