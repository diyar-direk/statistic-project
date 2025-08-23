import { Outlet } from "react-router";
import { Navigate } from "react-router";
import AuthHelper from "../utils/authHelper";

const ProtectedRout = () => {
  const isAuthenticated = new AuthHelper().isAuthenticated();
  if (isAuthenticated) return <Outlet />;
  return <Navigate to="/login" replace />;
};

export default ProtectedRout;
