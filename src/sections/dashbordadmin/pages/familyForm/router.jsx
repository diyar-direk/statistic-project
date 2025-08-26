import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const AddFamilyForm = lazy(() => import("./pages/AddFamilyForm"));
const FormFamilyView = lazy(() => import("./pages/FormFamilyView"));

const familyFormRouter = [
  {
    path: "/add_family_form",
    element: (
      <PageFallback>
        <AddFamilyForm />
      </PageFallback>
    ),
  },
  {
    path: "/family_form/:id",
    element: (
      <PageFallback>
        <FormFamilyView />
      </PageFallback>
    ),
  },
];
export default familyFormRouter;
