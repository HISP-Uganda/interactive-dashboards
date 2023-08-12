import React from "react";
import { IDashboard } from "../../interfaces";
import FixedDashboard from "../FixedDashboard";
import DynamicDashboard from "../DynamicDashboard";

export default function DashboardTemplate({
    dashboardTemplate,
}: {
    dashboardTemplate: IDashboard;
}) {
    if (dashboardTemplate.type === "fixed") {
        return <FixedDashboard dashboard={dashboardTemplate} />;
    }
    return <DynamicDashboard />;
}
