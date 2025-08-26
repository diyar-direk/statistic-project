import { lazy } from "react";
import PageFallback from "../../../../components/PageFallback";
const Statistics = lazy(() => import("./Statistics"));
const StatisticsRouter = [
  {
  
    element: (
   
        <PageFallback>
          <Statistics />
        </PageFallback>
   
    ),
      path: "/statistics",
  },
];
export default StatisticsRouter;
