import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const Addperson = lazy(() => import("./pages/Addperson"));
const CategoriesTable = lazy(() => import("./pages/CategoriesTable"));
const AddFamilyForm = lazy(() => import("./pages/AddFamilyForm"));

const familyFormRouter = [
  {
    path: "/",
    element: (
      <PageFallback>
        <CategoriesTable />
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
    path: "/add_person",
    element: (
      <PageFallback>
        <Addperson />
      </PageFallback>
    ),
  },
];
export default familyFormRouter;
