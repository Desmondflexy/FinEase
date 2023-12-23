import axios from "axios";

const developmnt = false;
const dev_url = "http://localhost:8080";
const prod_url = "https://finease-api.onrender.com";

const baseURL = developmnt ? dev_url : prod_url;
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
