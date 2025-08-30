import { lazy } from "react";
import PageFallBack from "src/components/PageFallBack";
const BackupManagement = lazy(() => import("./BackupManagement"));
const backupRouter = [
  {
    path: "/backup",
    element: (
      <PageFallBack>
        <BackupManagement />
      </PageFallBack>
    ),
  },
];
export default backupRouter;
