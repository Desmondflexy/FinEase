import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiService } from "../../api.service";
import { FineaseRoute } from "../../utils/constants";

export function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        apiService.logout();
        localStorage.removeItem('token');
        navigate(FineaseRoute.LOGIN);
    }, [navigate]);

    return null;
}