import axios from "axios";

const baseURL = import.meta.env.VITE_NODE_ENV === "production"? import.meta.env.VITE_SERVER_URL: "http://localhost:8080";

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
