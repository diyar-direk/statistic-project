import { lazy } from "react";
import PageFallback from "./../../components/PageFallback";
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";
const Login = lazy(() => import("./Login"));
const loginRouter = [
  {
    path: "/login",
    element: (
      <AuthProvider>
        <PageFallback>
          <Toaster position="top-center" />
          <Login />
        </PageFallback>
      </AuthProvider>
    ),
  },
];

export default loginRouter;
