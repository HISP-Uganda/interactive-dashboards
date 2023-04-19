import {
    Box,
    Flex,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Radio,
    RadioGroup,
    Stack,
    Text,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { ChangeEvent } from "react";
import {
    changeVisualizationAttribute,
    changeVisualizationProperties,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { createOptions } from "../../utils/utils";
import ColorPalette from "../ColorPalette";
import ColorRangePicker from "../ColorRangePicker";

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
    return (
        <Stack spacing="20px" pb="10px">
            <Stack>
                <Text>Label Alignment</Text>
                <Select<Option, false, GroupBase<Option>>
                    value={progressAlignments.find(
                        (pt) =>
                            pt.value ===
                            visualization.properties?.["data.alignment"]
                    )}
                    onChange={(e) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.alignment",
                            value: e?.value,
                        })
                    }
                    options={progressAlignments}
                    isClearable
                />
            </Stack>
            <Stack>
                <Text>Prefix</Text>
                <Input
                    value={visualization.properties?.["data.prefix"] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.prefix",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack>
                <Text>Suffix</Text>
                <Input
                    value={visualization.properties?.["data.suffix"] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.suffix",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>

            <Stack>
                <Text>Number format style</Text>
                <Select<Option, false, GroupBase<Option>>
                    value={formatStyleOptions.find(
                        (pt) =>
                            pt.value ===
                            visualization.properties["data.format.style"]
                    )}
                    onChange={(e) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.style",
                            value: e?.value,
                        })
                    }
                    options={formatStyleOptions}
                    isClearable
                />
            </Stack>

            <Stack>
                <Text>Number format notation</Text>
                <Select<Option, false, GroupBase<Option>>
                    value={numberFormatNotationOptions.find(
                        (pt) =>
                            pt.value ===
                            visualization.properties["data.format.notation"]
                    )}
                    onChange={(e) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.notation",
                            value: e?.value,
                        })
                    }
                    options={numberFormatNotationOptions}
                    isClearable
                />
            </Stack>
            <Stack>
                <Text>Single Value Background Color</Text>
                <ColorPalette
                    visualization={visualization}
                    attribute="layout.bg"
                />
            </Stack>
            <Stack>
                <Text>Single Value Border and Border Radius</Text>
                <NumberInput
                    value={visualization.properties["data.border"] || 0}
                    max={2}
                    min={0}
                    step={1}
                    onChange={(value1: string, value2: number) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.border",
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
                <Text>Number format decimal places</Text>
                <NumberInput
                    value={
                        visualization.properties[
                            "data.format.maximumFractionDigits"
                        ] || 0
                    }
                    max={4}
                    min={0}
                    onChange={(value1: string, value2: number) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.maximumFractionDigits",
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
                <Text>Value Font Size</Text>
                <NumberInput
                    value={
                        visualization.properties["data.format.fontSize"] || 2
                    }
                    max={10}
                    min={1}
                    step={0.1}
                    onChange={(value1: string, value2: number) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.fontSize",
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
                <Text>Value Font Weight</Text>
                <NumberInput
                    value={
                        visualization.properties["data.format.fontWeight"] ||
                        400
                    }
                    max={1000}
                    min={100}
                    step={50}
                    onChange={(value1: string, value2: number) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.fontWeight",
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
                <Text>Label Value Spacing</Text>
                <NumberInput
                    value={visualization.properties["data.format.spacing"] || 0}
                    max={100}
                    min={0}
                    step={1}
                    onChange={(value1: string, value2: number) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.format.spacing",
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
                <ColorRangePicker visualization={visualization} />
            </Stack>
            <Stack>
                <Text>Target</Text>
                <Input
                    value={visualization.properties?.["data.target"] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationAttribute({
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
