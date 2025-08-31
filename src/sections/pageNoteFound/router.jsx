import { lazy } from "react";
import PageFallBack from "src/components/PageFallBack";
import { AuthProvider } from "../../context/AuthContext";
const NotFound = lazy(() => import("./NotFound"));
export const notFoundRouter = [
  {
    path: "/*",
    element: (
      <AuthProvider>
        <PageFallBack>
          <NotFound />
        </PageFallBack>
      </AuthProvider>
    ),
  },
];
