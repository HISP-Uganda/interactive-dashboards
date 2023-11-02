import React from "react";
import { IDashboard } from "../../interfaces";
import FixedDashboard from "../FixedDashboard";
import DynamicDashboard from "../DynamicDashboard";
import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../../Store";

export default function DashboardTemplate({
    dashboardTemplate,
}: {
    dashboardTemplate: IDashboard;
}) {
    const store = useStore($store);
    return (
        <Stack
            h={store.isFullScreen ? "100vh" : "calc(100vh - 48px)"}
            p={`${dashboardTemplate.spacing}px`}
        >
            {dashboardTemplate.type === "fixed" ? (
                <FixedDashboard dashboard={dashboardTemplate} />
            ) : (
                <DynamicDashboard />
            )}
        </Stack>
    );
}
