import { createBrowserRouter, RouterProvider } from "react-router";
import categoriesRouter from "../sections/categories/router";
import { AuthProvider } from "../context/AuthContext";
import loginRouter from "../sections/login/router";
import ProtectedRout from "../components/ProtectedRout";
import dashboardadminRouter from "./../sections/dashbordadmin/router";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <ProtectedRout />
        </AuthProvider>
      ),
      children: [...categoriesRouter, ...dashboardadminRouter],
    },
    ...loginRouter,
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
