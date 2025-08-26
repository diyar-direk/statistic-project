import { createBrowserRouter, RouterProvider } from "react-router";
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
      children: [...dashboardadminRouter],
    },
    ...loginRouter,
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
