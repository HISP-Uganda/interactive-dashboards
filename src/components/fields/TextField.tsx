import React, { ChangeEvent } from "react";
import { Input, Stack, Text } from "@chakra-ui/react";
import { AttributeProps } from "../../interfaces";

export default function TextField<T>({
    title,
    obj,
    attribute,
    func,
}: AttributeProps<T>) {
    return (
        <Stack>
            <Text>{title}</Text>
            <Input
                value={`${obj[attribute]}`}
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
