import { lazy } from "react";
import PageFallback from "src/components/PageFallback";
const StatisticsPage = lazy(() => import("./StatisticsPage"));
const StatisticsRouter = [
  {
    element: (
      <PageFallback>
        <StatisticsPage />
      </PageFallback>
    ),
    path: "/statistics",
  },
];
export default StatisticsRouter;
