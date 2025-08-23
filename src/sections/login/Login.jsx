import { useFormik } from "formik";
import Input from "../../components/inputs/Input";
import loginSchema from "./../../schemas/loginSchema";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const nav = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async (values) => {
      const { data } = await axiosInstance.post("users/login", values);
      return data;
    },
    onSuccess: (data) => {
      login(data);
      nav(-1);
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
    <form onSubmit={formik.handleSubmit}>
      <Input
        title="username"
        placeholder="Enter your username"
        value={formik.values.username}
        onChange={formik.handleChange}
        errorText={formik.touched.username && formik.errors.username}
        name="username"
      />
      <Input
        title="password"
        type="password"
        placeholder="Enter your password"
        value={formik.values.password}
        onChange={formik.handleChange}
        errorText={formik.touched.password && formik.errors.password}
        name="password"
      />
      <Button
        type="submit"
        btnType="save"
        btnStyleType="outlined"
        isSending={mutation.isPending}
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
