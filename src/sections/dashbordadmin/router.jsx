import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const Addinformation=lazy(()=>import("./pages/Addinformation"))
const Createuser = lazy(() => import("./pages/Createuser"));
const dashboardadminRouter = [

  {
    path: "/addinformation",
    element: (
      <PageFallback>
        <Addinformation />
      </PageFallback>
    ),
  },
  
  {
    path:"/createuser",
    element: <PageFallback>
        <Createuser />
      </PageFallback>
  }
];
export default dashboardadminRouter;
