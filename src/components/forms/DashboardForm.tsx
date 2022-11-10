import { Spinner, Stack } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useDashboard } from "../../Queries";
import { $store } from "../../Store";
import Dashboard from "./Dashboard";

export default function DashboardForm() {
  const store = useStore($store);
  const {
    params: { dashboardId },
  } = useMatch<LocationGenerics>();
  const { isLoading, isSuccess, isError, error, isFetching } = useDashboard(
    dashboardId,
    store.systemId
  );
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      h="100%"
      w="100%"
    >
      {(isLoading || isFetching) && <Spinner />}
      {isSuccess && <Dashboard />}
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </Stack>
  );
}
