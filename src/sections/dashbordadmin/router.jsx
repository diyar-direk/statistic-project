import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const Addinformation=lazy(()=>import("./pages/Addaddress"))
const dashboardadminRouter = [

  {
    path: "/addinformation",
    element: (
      <PageFallback>
        <Addinformation />
      </PageFallback>
    ),
  },
];
export default dashboardadminRouter;
