import axios from "axios";
import AuthHelper from "./authHelper";

const baseURL = `http://192.168.1.89:8000/api/`;

const authHelper = new AuthHelper();

const axiosInstance = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${authHelper.getToken()}` },
});

export default axiosInstance;
