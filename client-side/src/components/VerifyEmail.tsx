import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Api from '../api.config';
import { useEffect } from 'react';
export default function VerifyEmail() {
    const { verifyId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        Api.patch(`/auth/email-verify/${verifyId}`)
            .then(res => {
                navigate('/auth/login');
                toast.success(res.data.message);
            })
            .catch(error => {
                navigate('/auth/login');
                toast.error(error.response.data.message);
            });
    });

    return null;
}