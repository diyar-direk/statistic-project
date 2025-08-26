import addressesRouter from "./pages/addresses/router";
import usersRouter from "./../users/router";
import familyFormRouter from "./pages/familyForm/router";
import StatisticsRouter from "./pages/statistics/router";

const dashboardadminRouter = [
  ...addressesRouter,
  ...usersRouter,
  ...familyFormRouter,
  ...StatisticsRouter,
];
export default dashboardadminRouter;
