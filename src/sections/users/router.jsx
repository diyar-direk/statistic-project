import { lazy } from "react";
import PageFallback from "./../../components/PageFallback";
const UsersTable = lazy(() => import("./UsersTable"));
const usersRouter = [
  {
    element: (
      <PageFallback>
        <UsersTable />
      </PageFallback>
    ),
    path: "/users",
  },
];
export default usersRouter;
