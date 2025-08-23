import { lazy } from "react";
import PageFallback from "./../../components/PageFallback";
const Login = lazy(() => import("./Login"));
const loginRouter = [
  {
    path: "/login",
    element: (
      <PageFallback>
        <Login />
      </PageFallback>
    ),
  },
];

export default loginRouter;
