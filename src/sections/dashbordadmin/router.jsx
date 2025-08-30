import addressesRouter from "./pages/addresses/router";
import usersRouter from "./../users/router";
import familyFormRouter from "./pages/familyForm/router";
import StatisticsRouter from "./pages/statistics/router";
import backupRouter from "./pages/backup/router";

const dashboardadminRouter = [
  ...addressesRouter,
  ...usersRouter,
  ...familyFormRouter,
  ...StatisticsRouter,
  ...backupRouter,
];
export default dashboardadminRouter;
