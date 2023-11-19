import axios from "axios";

const baseURL = "http://localhost:8080";
const Api = axios.create({ baseURL, withCredentials: true });

export default Api;
