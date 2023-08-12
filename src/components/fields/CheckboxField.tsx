import { Checkbox, Stack } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
import { AttributeProps } from "../../interfaces";

export default function CheckboxField<T>({
    title,
    obj,
    attribute,
    func,
}: AttributeProps<T>) {
    return (
        <Stack>
            <Checkbox
                isChecked={Boolean(obj[attribute])}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    func({ attribute, value: e.target.checked })
                }
            >
                {title}
            </Checkbox>
        </Stack>
    );
}
