// src/utils/AppRouter.jsx

import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import categoriesRouter from "../sections/categories/router";
import { AuthProvider } from "../context/AuthContext";
import loginRouter from "../sections/login/router";
import protectedRouter from "../sections/users/prottectedRouter";
import dashboardadminRouter from "../sections/dashbordadmin/router";
import Layout from "../components/layout/Layout";

const AppRouter = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <Toaster position="top-center" />
          <Layout onLogout={handleLogout} />
        </AuthProvider>
      ),
      children: [...categoriesRouter, ...loginRouter, ...protectedRouter, ...dashboardadminRouter],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;