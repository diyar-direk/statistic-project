// src/utils/AppRouter.jsx

import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import categoriesRouter from "../sections/categories/router";
import { AuthProvider } from "../context/AuthContext";
import loginRouter from "../sections/login/router";
import protectedRouter from "../sections/users/prottectedRouter";
import Layout from "../components/layout/Layout";
import addressesRouter from "../sections/dashbordadmin/pages/addresses/router";

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
      children: [...categoriesRouter, ...loginRouter, ...protectedRouter,...addressesRouter],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;