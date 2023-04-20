import React from "react";
import {
    Stack,
    Text,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { changeVisualizationProperties } from "../../Events";

export default function FiltersProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    return (
        <Stack>
            <Stack>
                <Text>Filter Items</Text>
                <CheckboxGroup
                    colorScheme="green"
                    onChange={(value) => {
                        console.log(value);
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "layout.items",
                            value,
                        });
                    }}
                    value={visualization.properties["layout.items"]}
                >
                    <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Checkbox value="periods">Periods</Checkbox>
                        <Checkbox value="organisations">Organisations</Checkbox>
                        <Checkbox value="attributes">Attributes</Checkbox>
                    </Stack>
                </CheckboxGroup>
            </Stack>
            <Stack>
                <Text>Alignment</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "layout.alignment",
                            value: e,
                        })
                    }
                    value={visualization.properties["layout.alignment"]}
                >
                    <Stack direction="row">
                        <Radio value="row">Row</Radio>
                        <Radio value="column">Column</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>
        </Stack>
    );
}
