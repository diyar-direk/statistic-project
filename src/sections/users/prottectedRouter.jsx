import usersRouter from "./router";
import ProtectedRout from "../../components/ProtectedRout";

const protectedRouter = [
  {
    element: <ProtectedRout />,
    children: [...usersRouter],
  },
];
export default protectedRouter;
