import addressesRouter from "./pages/addresses/router";
import usersRouter from "./../users/router";
import familyFormRouter from "./pages/familyForm/router";

const dashboardadminRouter = [
  ...addressesRouter,
  ...usersRouter,
  ...familyFormRouter,
];
export default dashboardadminRouter;
