import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const AddFamilyForm = lazy(() => import("./pages/AddFamilyForm"));
const FormFamilyTable = lazy(() => import("./pages/FormFamilyTable"));
const FormFamilyView = lazy(() => import("./pages/FormFamilyView"));
const PersonView = lazy(() => import("./pages/PersonView"));

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
  {
    path: "/family_form/:id",
    element: (
      <PageFallback>
        <FormFamilyView />
      </PageFallback>
    ),
  },
  {
    path: "/person/:id",
    element: (
      <PageFallback>
        <PersonView />
      </PageFallback>
    ),
  },
];
export default familyFormRouter;
