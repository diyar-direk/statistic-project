import PageFallback from "src/components/PageFallback";
import { lazy } from "react";
const Addperson=lazy(()=>import("./pages/Addperson"))
const CategoriesTable = lazy(() => import("./pages/CategoriesTable"));
const AddCategory = lazy(() => import("./pages/AddCategory"));
const UpdateCategory = lazy(() => import("./pages/UpdateCategory"));
const categoriesRouter = [
  {
    path: "/",
    element: (
      <PageFallback>
        <CategoriesTable />
      </PageFallback>
    ),
  },
  {
    path: "/add_category",
    element: (
      <PageFallback>
        <AddCategory />
      </PageFallback>
    ),
  },
  {
    path: "/update_category/:id",
    element: (
      <PageFallback>
        <UpdateCategory />
      </PageFallback>
    ),
  },
  {
    path:"/add_person",
    element: <PageFallback>
        <Addperson />
      </PageFallback>
  }
];
export default categoriesRouter;
