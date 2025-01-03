import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { toastError } from '../../utils/helpers';
import { apiService } from '../../api.service';
import { FineaseRoute } from '../../utils/constants';
export default function VerifyEmail() {
    const { verifyId } = useParams() as { verifyId: string };
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") as string;

    const navigate = useNavigate();
    useEffect(() => {
        apiService.verifyEmail(verifyId, email).then(res => {
            navigate(FineaseRoute.LOGIN);
            toast.success(res.data.message);
        }).catch(error => {
            navigate(FineaseRoute.LOGIN);
            toastError(error, toast);
        });
    });

    return null;
}