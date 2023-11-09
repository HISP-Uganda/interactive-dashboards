import { Stack, Switch, Text, StackProps } from "@chakra-ui/react";
import { sectionApi } from "../../Events";
import { VizProps } from "../../interfaces";

export default function SwitchProperty({
    visualization,
    attribute,
    title,
    ...rest
}: VizProps & StackProps) {
    return (
        <Stack {...rest}>
            <Text>{title}</Text>
            <Switch
                isChecked={visualization.properties[attribute]}
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute,
                        value: e.target.checked,
                    })
                }
            />
        </Stack>
    );
}
