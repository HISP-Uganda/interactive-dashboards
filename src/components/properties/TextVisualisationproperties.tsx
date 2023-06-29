import React, { ChangeEvent, useRef } from "react";
import { IVisualization } from "../../interfaces";
import {
    Stack,
    Text,
    Input,
    Button,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { sectionApi } from "../../Events";
import ColorProperty from "./ColorProperty";

export default function TextVisualisationproperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <Stack>
            <Stack>
                <Text>Text Size</Text>
                <NumberInput
                    value={visualization.properties["data.height"] || 20}
                    max={100}
                    min={20}
                    step={2}
                    onChange={(value1: string, value2: number) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.height",
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
                <Text>Text Color </Text>
                <ColorProperty
                    visualization={visualization}
                    title=""
                    attribute=""
                />
            </Stack>
        </Stack>
    );
}
