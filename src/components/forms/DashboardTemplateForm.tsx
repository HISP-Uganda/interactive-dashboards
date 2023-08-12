import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useDashboardTemplate } from "../../Queries";
import { $settings, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import DashboardTemplate from "./DashboardTemplate";
import AdminPanel from "../AdminPanel";

export default function DashboardTemplateForm() {
    const store = useStore($store);
    const { storage } = useStore($settings);
    const {
        params: { templateId },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error, data } = useDashboardTemplate(
        storage,
        templateId,
        store.systemId
    );
    if (isLoading) {
        return <LoadingIndicator />;
    }
    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isSuccess && data) {
        return (
            <Stack w="100%" bg={data.bg} spacing="0" h="calc(100vh - 48px)">
                {store.isAdmin && <AdminPanel />}
                <Stack
                    h={
                        store.isAdmin
                            ? "calc(100vh - 96px)"
                            : "calc(100vh - 48px)"
                    }
                    p={`${data.spacing}px`}
                    spacing="0"
                >
                    <DashboardTemplate dashboardTemplate={data} />
                </Stack>
                {/* </Stack> */}
            </Stack>
        );
    }
    return null;
}
