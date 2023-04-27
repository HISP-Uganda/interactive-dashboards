import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useDashboard } from "../../Queries";
import { $store, $settings, $dashboardType } from "../../Store";
import Dashboard from "./Dashboard";
import LoadingIndicator from "../LoadingIndicator";

export default function DashboardForm() {
    const store = useStore($store);
    const dashboardType = useStore($dashboardType);
    const { storage } = useStore($settings);
    const {
        params: { dashboardId },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } = useDashboard(
        storage,
        dashboardId,
        store.systemId,
        dashboardType,
        store.refresh,

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
            {isLoading && <LoadingIndicator />}
            {isSuccess && <Dashboard />}
            {isError && <pre>{JSON.stringify(error)}</pre>}
        </Stack>
    );
}
