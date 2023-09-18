import React from "react";
import { VizProps } from "../../interfaces";
import Picker from "../Picker";
import { sectionApi } from "../../Events";
import { Stack, Text } from "@chakra-ui/react";

export default function ColorProperty({
    attribute,
    visualization,
    title,
    disabled,
}: VizProps & { disabled?: boolean }) {
    return (
        <Stack>
            <Text>{title}</Text>
            <Picker
                color={visualization.properties[attribute]}
                onChange={(color) => {
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: attribute,
                        value: color,
                    });
                }}
            />
        </Stack>
    );
}
