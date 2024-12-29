import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./auth/Auth";

export default function Error(err: IError) {
    const navigate = useNavigate();

    const { code, message, goto } = err;

    useEffect(() => {
        if (code === 401 || code === 403) {
            localStorage.removeItem('token');
            navigate('/auth/login');
        }
    }, [code, navigate]);


    return (
        <div id="error-screen">
            <Header />
            <h1>Error {code}</h1>
            <p>{message}</p>
            <Link to={goto}>{goto === '/auth/login' ? 'Login' : 'Home'}</Link>
        </div>
    )
}

type IError = {
    code: number;
    message: string;
    goto: string
}