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
import { sectionApi } from "../../Events";
import SwitchProperty from "./SwitchProperty";
import CategoryComboFilter from "../visualizations/CategoryComboFilter";

export default function FiltersProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const items = visualization.properties["layout.items"] ?? [];
    const value = visualization.properties["cc"];
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

            {items.indexOf("category-combo") !== -1 && (
                <CategoryComboFilter
                    api={null}
                    isCurrentDHIS2={true}
                    value={value}
                    onChange={(val) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "cc",
                            value: val,
                        })
                    }
                />
            )}

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
