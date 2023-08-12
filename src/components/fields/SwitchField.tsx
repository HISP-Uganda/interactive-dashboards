import React from "react";
import { Stack, Switch, Text } from "@chakra-ui/react";

import { AttributeProps } from "../../interfaces";

export default function SwitchField<T>({
    title,
    func,
    attribute,
    obj,
}: AttributeProps<T>) {
    return (
        <Stack>
            <Text>{title}</Text>
            <Switch
                isChecked={Boolean(obj[attribute])}
                onChange={(e) =>
                    func({
                        attribute,
                        value: e.target.checked,
                    })
                }
            />
        </Stack>
    );
}
