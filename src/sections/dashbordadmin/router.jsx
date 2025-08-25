import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
import addressesRouter from "./pages/addresses/router";
import usersRouter from "../users/router";
const Addinformation = lazy(() => import("./pages/Addinformation"));
const Createuser = lazy(() => import("./pages/Createuser"));
const dashboardadminRouter = [
  {
    path: "/addinformation",
    element: (
      <PageFallback>
        <Addinformation />
      </PageFallback>
    ),
  },
  {
    path: "/createuser",
    element: (
      <PageFallback>
        <Createuser />
      </PageFallback>
    ),
  },
  ...addressesRouter,
  ...usersRouter,
];
export default dashboardadminRouter;
