import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Navigate } from "@tanstack/react-location";
import { $dashboard, $store } from "../Store";

export default function Home() {
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  return (
    <Stack>
      {store.hasDashboards && store.hasDefaultDashboard ? (
        <Navigate to={`/dashboards/${dashboard.id}`} />
      ) : store.hasDashboards ? (
        <Navigate to={`/dashboards`} />
      ) : (
        <Navigate to={`/data-sources`} />
      )}
    </Stack>
  );
}
