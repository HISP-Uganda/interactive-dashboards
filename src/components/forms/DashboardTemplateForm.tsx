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
        return <DashboardTemplate dashboardTemplate={data} />;
    }
    return null;
}
