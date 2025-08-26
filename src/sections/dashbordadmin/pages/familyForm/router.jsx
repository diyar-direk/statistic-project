import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const AddFamilyForm = lazy(() => import("./pages/AddFamilyForm"));

const familyFormRouter = [
  {
    path: "/add_family_form",
    element: (
      <PageFallback>
        <AddFamilyForm />
      </PageFallback>
    ),
  },
];
export default familyFormRouter;
