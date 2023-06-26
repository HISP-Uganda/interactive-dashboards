import React from 'react'
import ColorPalette from "../ColorPalette";
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { sectionApi } from "../../Events";

const DashboardTitleProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    return (
        <Stack spacing="20px" pb="10px">
            <Text>Title font size</Text>
            <NumberInput
                value={2}
                max={10}
                min={1}
                step={0.1}

            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <Text>Title font weight</Text>
            <NumberInput
                value={2}
                max={10}
                min={1}
                step={0.1}

            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <Text>Title font color</Text>
            <ColorPalette
                visualization={visualization}
                attribute="data.title.color"
            />
        </Stack>
    )
}

export default DashboardTitleProperties
