import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FineaseRoute } from "../utils/constants";
// import { Header } from "./auth/Auth";

export default function AppError(err: IError) {
    const navigate = useNavigate();

    const { code, message, goto } = err;

    useEffect(() => {
        if (code === 401 || code === 403) {
            localStorage.removeItem('token');
            navigate(FineaseRoute.LOGIN);
        }
    }, [code, navigate]);


    return (
        <div id="error-screen">
            {/* <Header /> */}
            <h1>Error {code}</h1>
            <p>{message}</p>
            <Link to={goto}>{goto === FineaseRoute.LOGIN ? 'Login' : 'Home'}</Link>
        </div>
    )
}

type IError = {
    code: number;
    message: string;
    goto: string
}