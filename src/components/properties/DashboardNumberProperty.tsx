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
import { dashboardApi } from "../../Events";
import { IDashboard } from "../../interfaces";

export default function DashboardNumberProperty({
    dashboard,
    attribute,
    title,
    min = 0,
    max = 100,
    step = 1,
}: {
    max?: number;
    step?: number;
    min?: number;
    attribute: keyof IDashboard;
    title: string;
    dashboard: IDashboard;
}) {
    return (
        <Stack direction="row" alignItems="center">
            <Text>{title}</Text>
            <NumberInput
                value={String(dashboard[attribute])}
                max={max}
                min={min}
                step={step}
                size="sm"
                w="80px"
                onChange={(value1: string, value2: number) =>
                    dashboardApi.changeAttribute({
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
