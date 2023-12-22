import axios from "axios";

const dev_url = "http://localhost:8080";
// const prod_url = "https://finease-api.onrender.com";
const options = {
  baseURL: dev_url,
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
