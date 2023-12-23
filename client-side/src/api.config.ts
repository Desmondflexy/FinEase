import axios from "axios";

const development_mode = false;
const baseURL = development_mode
  ? "http://localhost:8080"
  : "https://finease-api.onrender.com";

const options = {
  baseURL,
  withCredentials: true,
}
const Api = axios.create(options);

Api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
