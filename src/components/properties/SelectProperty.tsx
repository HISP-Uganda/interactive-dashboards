import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import React from "react";
import { sectionApi } from "../../Events";
import { Option, VizProps } from "../../interfaces";

export default function SelectProperty({
    visualization,
    attribute,
    title,
    options,
}: VizProps & {
    options: Option[];
}) {
    return (
        <Stack>
            <Text>{title}</Text>
            <Select<Option, false, GroupBase<Option>>
                value={options.find(
                    (pt) => pt.value === visualization.properties[attribute]
                )}
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: attribute,
                        value: e?.value,
                    })
                }
                options={options}
                isClearable
                menuPlacement="top"
                size="sm"
            />
        </Stack>
    );
}
