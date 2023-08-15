import { Input, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { VizProps } from "../../interfaces";

export default function TextProperty({
    visualization,
    attribute,
    title,
    disabled,
}: VizProps & { disabled?: boolean }) {
    return (
        <Stack>
            <Text>{title}</Text>
            <Input
                value={visualization.properties[attribute] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: attribute,
                        value: e.target.value,
                    })
                }
                isDisabled={disabled}
            />
        </Stack>
    );
}
