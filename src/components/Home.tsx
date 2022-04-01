import { Flex, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Navigate } from "react-location";
import { $store } from "../Store";

export default function Home() {
  const store = useStore($store);
  return (
    <Stack>
      {store.hasDashboards && store.hasDefaultDashboard ? (
        <Navigate to={`/dashboards/${store.dashboard.id}`} />
      ) : store.hasDashboards ? (
        <Navigate to={`/dashboards`} />
      ) : (
        <Navigate to={`/data-sources`} />
      )}
    </Stack>
  );
}
