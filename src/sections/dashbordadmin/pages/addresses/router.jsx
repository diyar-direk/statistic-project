import { lazy } from "react";
import PageFallback from "./../../../../components/PageFallback";
const Cities = lazy(() => import("./Cities"));
const addressesRouter = [
  {
    path: "/cities",
    element: (
      <PageFallback>
        <Cities />
      </PageFallback>
    ),
  },
];

export default addressesRouter;
