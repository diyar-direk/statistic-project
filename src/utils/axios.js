import axios from "axios";
import AuthHelper from "./authHelper";

const baseURL = `http://127.0.0.1:8000/api/`;

const authHelper = new AuthHelper();

const axiosInstance = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${authHelper.getToken()}` },
});

export default axiosInstance;
