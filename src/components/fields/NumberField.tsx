import React from "react";
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
    StackProps,
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
    ...rest
}: AttributeProps<T> & {
    min?: number;
    max?: number;
    step?: number;
    visualization?: string;
} & StackProps) {
    return (
        <Stack {...rest}>
            <Text>{title}</Text>
            <NumberInput
                value={String(obj[attribute])}
                max={max}
                min={min}
                step={step}
                size="sm"
                w="100px"
                onChange={(_, value2: number) =>
                    func({
                        attribute,
                        value: value2,
                    })
                }
                flex={
                    rest.direction && rest.direction === "row" ? 1 : undefined
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
