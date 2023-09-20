import React from "react";
import { Stack, Text, StackProps, Box } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { AttributeProps } from "../../interfaces";

export default function SelectField<T, U>({
    title,
    func,
    obj,
    options,
    multiple,
    labelField,
    valueField,
    attribute,
    ...rest
}: AttributeProps<T> & {
    options: U[];
    multiple: boolean | undefined;
    labelField: keyof U;
    valueField: keyof U;
} & StackProps) {
    return (
        <Stack {...rest}>
            <Text>{title}</Text>
            {multiple ? (
                <Box
                    flex={
                        rest.direction && rest.direction === "row"
                            ? 1
                            : undefined
                    }
                >
                    <Select<U, true, GroupBase<U>>
                        isMulti
                        value={options.filter(
                            (pt) =>
                                String(obj[attribute])
                                    .split(",")
                                    .indexOf(String(pt[valueField])) !== -1
                        )}
                        onChange={(e) =>
                            func({
                                attribute,
                                value: e
                                    .map((ex) => String(ex[valueField]))
                                    .join(","),
                            })
                        }
                        options={options}
                        isClearable
                        menuPlacement="top"
                        getOptionValue={(val) => String(val[valueField])}
                        getOptionLabel={(val) => String(val[labelField])}
                    />
                </Box>
            ) : (
                <Box
                    flex={
                        rest.direction && rest.direction === "row"
                            ? 1
                            : undefined
                    }
                >
                    <Select<U, false, GroupBase<U>>
                        value={options.find(
                            (pt) =>
                                String(pt[valueField]) ===
                                String(obj[attribute])
                        )}
                        onChange={(e) =>
                            func({
                                attribute,
                                value: e?.[valueField],
                            })
                        }
                        options={options}
                        isClearable
                        menuPlacement="top"
                        getOptionValue={(val) => String(val[valueField])}
                        getOptionLabel={(val) => String(val[labelField])}
                        size="sm"
                    />
                </Box>
            )}
        </Stack>
    );
}
