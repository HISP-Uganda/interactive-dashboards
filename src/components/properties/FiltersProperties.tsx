import {
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Stack,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { sectionApi } from "../../Events";
import { IVisualization } from "../../interfaces";
import SwitchProperty from "./SwitchProperty";

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
                        sectionApi.changeVisualizationProperties({
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
                        <Checkbox value="organisations-levels">
                            Organisations Levels
                        </Checkbox>
                        <Checkbox value="attributes">Attributes</Checkbox>
                        <Checkbox value="dates">Date Ranges</Checkbox>
                        <Checkbox value="category-combo">
                            Category Combo
                        </Checkbox>
                    </Stack>
                </CheckboxGroup>
            </Stack>

            <SwitchProperty
                visualization={visualization}
                title="Group"
                attribute="grouped"
            />

            {!visualization.properties["group"] && (
                <Stack>
                    <Text>Alignment</Text>
                    <RadioGroup
                        onChange={(e: string) =>
                            sectionApi.changeVisualizationProperties({
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
            )}
        </Stack>
    );
}
