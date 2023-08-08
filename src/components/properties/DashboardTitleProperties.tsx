import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { IVisualization } from "../../interfaces";
import NumberProperty from "./NumberProperty";
import ColorPalette from "../ColorPalette";

const DashboardTitleProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    return (
        <Stack spacing="20px" pb="10px">
            <NumberProperty
                title="Font size"
                visualization={visualization}
                attribute="fontSize"
            />
            <Stack>
                <Text>Title font color</Text>
                <ColorPalette visualization={visualization} attribute="color" />
            </Stack>
            <NumberProperty
                title="Font Weight"
                visualization={visualization}
                attribute="fontWeight"
                min={100}
                max={900}
                step={50}
            />
        </Stack>
    );
};

export default DashboardTitleProperties;
