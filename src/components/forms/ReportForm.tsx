import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import React from "react";
import { reportApi } from "../../Events";
import { IReport, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createReport } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import Report from "./Report";

export default function ReportForm() {
    const { storage } = useStore($settings);
    const store = useStore($store);
    const {
        params: { reportId },
        search: { action },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } =
        useSingleNamespace<IReport>(
            storage,
            reportId,
            store.systemId,
            "i-reports",
            action,
            reportApi.setReport,
            createReport(reportId)
        );
    return (
        <Stack
            p={`${generalPadding}px`}
            bgColor="white"
            flex={1}
            h={otherHeight}
            maxH={otherHeight}
            justifyContent="center"
            justifyItems="center"
            alignContent="center"
            alignItems="center"
            w="100%"
        >
            {isLoading && <LoadingIndicator />}
            {isSuccess && <Report />}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}
