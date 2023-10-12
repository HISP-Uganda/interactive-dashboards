import React from "react";
import { Stack, Text } from "@chakra-ui/react";
import NumberProperty from "./NumberProperty";
import ColorPalette from "../ColorPalette";
import { IVisualization } from "../../interfaces";
import SwitchProperty from "./SwitchProperty";

export default function DashboardListProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    return (
        <Stack spacing="20px" pb="10px">
            <SwitchProperty
                title="Sort Dashboards"
                visualization={visualization}
                attribute="sort"
            />
            <SwitchProperty
                title="Descending"
                visualization={visualization}
                attribute="descending"
            />
        </Stack>
    );
}
