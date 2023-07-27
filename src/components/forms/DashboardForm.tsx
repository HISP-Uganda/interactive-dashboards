import { Stack } from "@chakra-ui/react";
import { useMatch, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useDashboard } from "../../Queries";
import { $dashboardType, $settings, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import Dashboard from "./Dashboard";

export default function DashboardForm() {
    const store = useStore($store);
    const dashboardType = useStore($dashboardType);
    const { storage } = useStore($settings);
    const {
        params: { dashboardId },
    } = useMatch<LocationGenerics>();
    const { action } = useSearch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } = useDashboard(
        storage,
        dashboardId,
        store.systemId,
        dashboardType,
        action
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
