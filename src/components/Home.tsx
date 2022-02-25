import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Navigate } from "react-location";
import { $store } from "../Store";
import NewCategoryDialog from "./NewCategoryDialog";
import NewDashboardDialog from "./NewDashboardDialog";

export default function Home() {
  const store = useStore($store);
  return (
    <Stack>
      {store.dashboard.sections.length > 0 ? (
        <Navigate to={`/dashboards/${store.dashboard.id}`} />
      ) : (
        <Stack direction="row">
          <NewCategoryDialog />
          <NewDashboardDialog />
        </Stack>
      )}
    </Stack>
  );
}
