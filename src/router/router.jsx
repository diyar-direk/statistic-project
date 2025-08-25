import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import loginRouter from "../sections/login/router";
import ProtectedRout from "../components/ProtectedRout";
import dashboardadminRouter from "./../sections/dashbordadmin/router";
import familyFormRouter from "../sections/familyForm/router";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <ProtectedRout />
        </AuthProvider>
      ),
      children: [...familyFormRouter, ...dashboardadminRouter],
    },
    ...loginRouter,
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
