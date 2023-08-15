import React from "react";
import { Radio, RadioGroup, Stack, Switch, Text } from "@chakra-ui/react";

import { AttributeProps, Option } from "../../interfaces";

export default function RadioField<T>({
    options,
    title,
    obj,
    attribute,
    func,
}: AttributeProps<T> & {
    options: Option[];
}) {
    return (
        <Stack>
            <Text>{title}</Text>
            <RadioGroup
                onChange={(e) =>
                    func({
                        attribute,
                        value: e,
                    })
                }
                value={String(obj[attribute])}
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
