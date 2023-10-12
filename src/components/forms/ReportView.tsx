import { Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import React from "react";
import { reportApi } from "../../Events";
import { IReport, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createReport } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import DashboardReport from "./DashboardReport";

export default function ReportView() {
    const {
        params: { reportId },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } =
        useSingleNamespace<IReport>(
            storage,
            reportId,
            store.systemId,
            "i-reports",
            "view",
            reportApi.setReport,
            createReport(reportId)
        );
    if (isError) return <Text>{error?.message}</Text>;
    if (isLoading) return <LoadingIndicator />;
    if (isSuccess) return <DashboardReport />;
    return null;
}
