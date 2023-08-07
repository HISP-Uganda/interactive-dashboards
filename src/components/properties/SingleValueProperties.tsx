import {
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { GroupBase, Select } from "chakra-react-select";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import {
    alignItemsOptions,
    createOptions,
    justifyContentOptions,
} from "../../utils/utils";
import ColorPalette from "../ColorPalette";
import ColorRangePicker from "../ColorRangePicker";
import SelectProperty from "./SelectProperty";
import TextProperty from "./TextProperty";
import NumberProperty from "./NumberProperty";
import SwitchProperty from "./SwitchProperty";
import { useStore } from "effector-react";
import { $visualizationData } from "../../Store";
import { uniq, flatten } from "lodash";

const progressAlignments: Option[] = [
    {
        label: "Column",
        value: "column",
    },
    {
        label: "Column Reverse",
        value: "column-reverse",
    },
    {
        label: "Row",
        value: "row",
    },
    {
        label: "Row Reverse",
        value: "row-reverse",
    },
];

const formatStyleOptions = createOptions(["decimal", "percent", "currency"]);
const numberFormatNotationOptions = createOptions(["standard", "compact"]);
const targetGraphOptions = createOptions(["progress", "circular"]);

const SingleValueProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = useStore($visualizationData);
    const [currentValues, setCurrentValues] = useState<Option[]>([]);
    const normalColumns = uniq(
        flatten(
            flatten(visualizationData[visualization.id] || []).map((d) =>
                Object.keys(d)
            )
        )
    );
    useEffect(() => {
        setCurrentValues(() =>
            uniq(
                visualizationData[visualization.id]?.map(
                    (d) =>
                        d[visualization.properties["aggregationColumn"] || ""]
                ) || []
            )
                .filter((d) => !!d)
                .map((d) => {
                    return { label: d, value: d, span: 1, actual: d };
                })
        );

        return () => {};
    }, [visualization.properties["aggregationColumn"]]);

    return (
        <Stack spacing="20px" pb="10px">
            <SwitchProperty
                visualization={visualization}
                title="Aggregate"
                attribute="aggregate"
            />
            <SelectProperty
                visualization={visualization}
                title="Aggregation Column"
                attribute="aggregationColumn"
                options={createOptions(normalColumns)}
            />
            <SelectProperty
                visualization={visualization}
                title="Aggregation Strategy"
                attribute="aggregationStrategy"
                options={createOptions(["all", "first", "last", "max", "min"])}
            />
            <SelectProperty
                visualization={visualization}
                title="Aggregation Strategy Columns"
                attribute="aggregationStrategyColumn"
                options={createOptions(normalColumns)}
            />
            <SelectProperty
                visualization={visualization}
                title="Uniq Column"
                attribute="uniqColumn"
                options={createOptions(normalColumns)}
            />
            <TextProperty
                visualization={visualization}
                title="Specific Key"
                attribute="key"
            />

            <SelectProperty
                visualization={visualization}
                title="Label Alignment"
                attribute="data.alignment"
                options={progressAlignments}
            />
            <SelectProperty
                visualization={visualization}
                title="Justify Content"
                attribute="data.justifyContent"
                options={justifyContentOptions}
            />
            <SelectProperty
                visualization={visualization}
                title="Align Items"
                attribute="data.alignItems"
                options={alignItemsOptions}
            />
            <TextProperty
                visualization={visualization}
                title="Prefix"
                attribute="data.prefix"
            />

            <TextProperty
                visualization={visualization}
                title="Suffix"
                attribute="data.suffix"
            />

            <SelectProperty
                visualization={visualization}
                title="Number format style"
                attribute="data.format.style"
                options={formatStyleOptions}
            />
            <SelectProperty
                visualization={visualization}
                title="Number format notation"
                attribute="data.format.notation"
                options={numberFormatNotationOptions}
            />
            <Stack>
                <Text>Single Value Background Color</Text>
                <ColorPalette
                    visualization={visualization}
                    attribute="layout.bg"
                />
            </Stack>

            <NumberProperty
                visualization={visualization}
                max={2}
                min={0}
                step={1}
                attribute="data.border"
                title="Single Value Border and Border Radius"
            />

            <NumberProperty
                visualization={visualization}
                max={4}
                min={0}
                step={1}
                attribute="data.format.maximumFractionDigits"
                title="Number format decimal places"
            />
            <NumberProperty
                visualization={visualization}
                max={4}
                min={0}
                step={1}
                attribute="data.format.fontSize"
                title="Value Font Size"
            />
            <NumberProperty
                visualization={visualization}
                max={4}
                min={0}
                step={1}
                attribute="data.format.fontWeight"
                title="Value Font Weight"
            />
            <NumberProperty
                visualization={visualization}
                max={4}
                min={0}
                step={1}
                attribute="data.format.spacing"
                title="Label Value Spacing"
            />

            <ColorRangePicker visualization={visualization} />
            <TextProperty
                visualization={visualization}
                title="Suffix"
                attribute="data.suffix"
            />
            <Stack>
                <Text>Target</Text>
                <Input
                    value={visualization.properties?.["data.target"] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.target",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack>
                <Text>Target Graph</Text>
                <Select<Option, false, GroupBase<Option>>
                    value={targetGraphOptions.find(
                        (pt) =>
                            pt.value ===
                            visualization.properties?.["data.targetgraph"]
                    )}
                    onChange={(e) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.targetgraph",
                            value: e?.value,
                        })
                    }
                    options={targetGraphOptions}
                    isClearable
                />
            </Stack>

            <Stack>
                <Text>Target Direction</Text>
                <Select<Option, false, GroupBase<Option>>
                    value={progressAlignments.find(
                        (pt) =>
                            pt.value ===
                            visualization.properties?.["data.direction"]
                    )}
                    onChange={(e) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.direction",
                            value: e?.value,
                        })
                    }
                    options={progressAlignments}
                    isClearable
                />
            </Stack>

            <Stack>
                <Text>Target Spacing</Text>
                <NumberInput
                    value={visualization.properties["data.targetspacing"] || 0}
                    min={0}
                    step={1}
                    onChange={(value1: string, value2: number) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.targetspacing",
                            value: value2,
                        })
                    }
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Stack>

            <Stack>
                <Text>Target Color</Text>
                <ColorPalette
                    visualization={visualization}
                    attribute="data.targetcolor"
                />
            </Stack>

            <Stack>
                <Text>Thickness</Text>
                <NumberInput
                    value={
                        visualization.properties["data.targetthickness"] || 0
                    }
                    min={0}
                    step={1}
                    onChange={(value1: string, value2: number) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.targetthickness",
                            value: value2,
                        })
                    }
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Stack>

            <Stack>
                <Text>Radius</Text>
                <NumberInput
                    value={visualization.properties["data.targetradius"] || 0}
                    min={30}
                    step={1}
                    onChange={(value1: string, value2: number) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.targetradius",
                            value: value2,
                        })
                    }
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Stack>
            <Stack>
                <Text>Grouping</Text>
                <Input
                    value={visualization.group}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        sectionApi.changeVisualizationAttribute({
                            visualization: visualization.id,
                            attribute: "group",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
        </Stack>
    );
};

export default SingleValueProperties;
