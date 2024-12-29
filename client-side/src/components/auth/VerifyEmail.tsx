import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { toastError } from '../../utils/helpers';
import { apiService } from '../../api.service';
export default function VerifyEmail() {
    const { verifyId } = useParams() as { verifyId: string };
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") as string;

    const navigate = useNavigate();
    useEffect(() => {
        apiService.verifyEmail(verifyId, email).then(res => {
            navigate('/auth/login');
            toast.success(res.data.message);
        }).catch(error => {
            navigate('/auth/login');
            toastError(error, toast);
        });
    });

    return null;
}