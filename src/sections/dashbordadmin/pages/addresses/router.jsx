import { lazy } from "react";
import PageFallback from "./../../../../components/PageFallback";

const Cities = lazy(() => import("./Cities"));
const Villagestowns = lazy(() => import("./villages-towns"))
const Councils = lazy (() => import("./councils"))
const Communes = lazy (() => import("./communes"))
const addressesRouter = [
  {
    path: "/cities",
    element: (
      <PageFallback>
        <Cities />
      </PageFallback>
    ),
  },
   {
    path: "/villagestowns",
    element: (
      <PageFallback>
        <Villagestowns />
      </PageFallback>
    ),
  },
     {
    path: "/councils",
    element: (
      <PageFallback>
        <Councils />
      </PageFallback>
    ),
  },
       {
    path: "/communes",
    element: (
      <PageFallback>
        <Communes />
      </PageFallback>
    ),
  },
];

export default addressesRouter;
