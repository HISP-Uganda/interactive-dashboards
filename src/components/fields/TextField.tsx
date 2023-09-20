import React, { ChangeEvent } from "react";
import { Input, Stack, Text, StackProps } from "@chakra-ui/react";
import { AttributeProps } from "../../interfaces";

export default function TextField<T>({
    title,
    obj,
    attribute,
    func,
    ...rest
}: AttributeProps<T> & StackProps) {
    return (
        <Stack {...rest}>
            <Text>{title}</Text>
            <Input
                value={`${obj[attribute]}`}
                flex={
                    rest.direction && rest.direction === "row" ? 1 : undefined
                }
                size="sm"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    func({
                        attribute,
                        value: e.target.value,
                    })
                }
            />
        </Stack>
    );
}
