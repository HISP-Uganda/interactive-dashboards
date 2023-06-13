import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { sectionApi } from "../../Events";
import { VizProps } from "../../interfaces";

export default function NumberProperty({
    visualization,
    attribute,
    title,
    min = 0,
    max = 100,
    step = 1,
}: VizProps & { max?: number; step?: number; min?: number }) {
    return (
        <Stack>
            <Text>{title}</Text>
            <NumberInput
                value={visualization.properties[attribute] || 0}
                max={max}
                min={min}
                step={step}
                size="sm"
                onChange={(value1: string, value2: number) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: attribute,
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
    );
}
