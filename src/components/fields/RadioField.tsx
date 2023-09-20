import React from "react";
import {
    Radio,
    RadioGroup,
    Stack,
    Switch,
    Text,
    StackProps,
} from "@chakra-ui/react";

import { AttributeProps, Option } from "../../interfaces";

export default function RadioField<T>({
    options,
    title,
    obj,
    attribute,
    func,
    ...rest
}: AttributeProps<T> & {
    options: Option[];
} & StackProps) {
    return (
        <Stack {...rest}>
            <Text>{title}</Text>
            <RadioGroup
                onChange={(e) =>
                    func({
                        attribute,
                        value: e,
                    })
                }
                value={String(obj[attribute])}
                flex={
                    rest.direction && rest.direction === "row" ? 1 : undefined
                }
            >
                <Stack direction="row">
                    {options.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Stack>
    );
}
