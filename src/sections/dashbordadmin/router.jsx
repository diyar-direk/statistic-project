import addressesRouter from "./pages/addresses/router";
import usersRouter from "./../users/router";

const dashboardadminRouter = [...addressesRouter, ...usersRouter];
export default dashboardadminRouter;
