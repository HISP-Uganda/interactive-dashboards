import React from "react";
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from "@chakra-ui/react";
import { AttributeProps } from "../../interfaces";
export default function NumberField<T>({
    title,
    min = 0,
    max = 100,
    step = 1,
    attribute,
    obj,
    func,
}: AttributeProps<T> & { min?: number; max?: number; step?: number }) {
    return (
        <Stack direction="row" alignItems="center">
            <Text>{title}</Text>
            <NumberInput
                value={String(obj[attribute])}
                max={max}
                min={min}
                step={step}
                size="sm"
                w="80px"
                onChange={(_, value2: number) =>
                    func({
                        attribute,
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
