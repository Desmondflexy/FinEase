import axios from "axios";

let baseURL = "http://localhost:8080/api/v2";
if (import.meta.env.VITE_NODE_ENV === "production") {
    baseURL = import.meta.env.VITE_SERVER_URL;
}

const Api = axios.create({
    baseURL,
    withCredentials: true,
});

Api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api;
