import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AuthHelper from "../utils/authHelper";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import Loading from "./../components/loading/Loading";
import { useNavigate } from "react-router";

const AuthContext = createContext();
const authHelper = new AuthHelper();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = authHelper.getToken();
  const isAuthenticated = authHelper.isAuthenticated();

  const nav = useNavigate();

  const login = useCallback(
    (data) => {
      setUser(data.user);
      authHelper.setToken(data.token);
    },
    [setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    authHelper.clearToken();
    nav("/login");
  }, [nav]);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.method !== "get") {
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        if (response.config.method !== "get") {
          const message = response?.data?.message || "Operation done";
          toast.success(message);
        }
        return response;
      },
      (error) => {
        setLoading(false);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        toast.error(message);

        if (error.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout]);

  const getUserDetails = useCallback(async () => {
    const { data } = await axiosInstance.get("users/profile/me");
    return setUser(data.data);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user) {
      getUserDetails();
    }
  }, [isAuthenticated, getUserDetails, user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
      {loading && <Loading />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
