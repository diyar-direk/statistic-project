import { Navigate } from "react-router";
import AuthHelper from "../utils/authHelper";
import Layout from "./layout/Layout";
import { Toaster } from "react-hot-toast";

const ProtectedRout = () => {
  const isAuthenticated = new AuthHelper().isAuthenticated();

  if (isAuthenticated)
    return (
      <>
        <Toaster position="top-center" />
        <Layout />
      </>
    );
  return <Navigate to="/login" replace />;
};

export default ProtectedRout;
