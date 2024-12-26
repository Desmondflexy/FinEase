import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiService } from "../api.service";

export function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        apiService.logout();
        localStorage.removeItem('token');
        navigate('/auth/login');
    });

    return null;
}