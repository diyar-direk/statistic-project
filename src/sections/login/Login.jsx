import { useFormik } from "formik";
import Input from "../../components/inputs/Input";
import loginSchema from "./../../schemas/loginSchema";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import "./login.css"
const Login = () => {
  const nav = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async (values) => {
      const { data } = await axiosInstance.post("auth/token/", values);
      return data;
    },
    onSuccess: (data) => {
      login(data);
      nav("/");
    },
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="input-field"
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;