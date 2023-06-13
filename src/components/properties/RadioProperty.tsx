import React from "react";
import { Radio, RadioGroup, Stack, Switch, Text } from "@chakra-ui/react";
import { VizProps, Option } from "../../interfaces";
import { sectionApi } from "../../Events";

export default function RadioProperty({
    visualization,
    attribute,
    title,
    options,
}: VizProps & { options: Option[] }) {
    return (
        <Stack>
            <Text>{title}</Text>
            <RadioGroup
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute,
                        value: e,
                    })
                }
                value={visualization.properties[attribute]}
            >
                <Stack direction="row">
                    {options.map((option) => (
                        <Radio value={option.value}>{option.label}</Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Stack>
    );
}
