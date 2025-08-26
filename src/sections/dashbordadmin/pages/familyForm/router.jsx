import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const AddFamilyForm = lazy(() => import("./pages/AddFamilyForm"));
const FormFamilyTable = lazy(() => import("./pages/FormFamilyTable"));

const familyFormRouter = [
    {
    path: "/",
    element: (
      <PageFallback>
        <FormFamilyTable />
      </PageFallback>
    ),
  },
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
