import { Box, Stack, Text } from "@chakra-ui/react";

import { chakraComponents, GroupBase, OptionProps } from "chakra-react-select";
import { Option } from "../interfaces";
import { ColumnsType } from "antd/es/table";
import { invertHex } from "../components/processors";
export const customComponents = {
    Option: ({
        children,
        ...props
    }: OptionProps<Option, false, GroupBase<Option>>) => (
        <chakraComponents.Option {...props}>
            <Stack w="100%" spacing={0}>
                <Text>{children}</Text>
                <Stack w="100%" direction="row" spacing="0">
                    {props.data.value.split(",").map((c) => (
                        <Box bgColor={c} key={c} w="100%"></Box>
                    ))}
                </Stack>
            </Stack>
        </chakraComponents.Option>
    ),
};

export function columnTree(
    list: Array<ColumnsType<any>>,
    properties: { [key: string]: any }
): Array<ColumnsType<any>> {
    if (list.length === 0) {
        return [];
    } else if (list.length === 1) {
        return [
            list[0].map((a) => {
                return {
                    ...a,
                    render(text, record) {
                        return {
                            props: {
                                style: {
                                    background: record[`${a.key}bg`],
                                    color: invertHex(
                                        record[`${a.key}bg`],
                                        true
                                    ),
                                },
                            },
                            children: text,
                        };
                    },
                };
            }),
        ];
    } else if (list.length === 2) {
        return columnTree(
            [
                list[0].map((a) => {
                    return {
                        ...a,
                        children: list[1].map((b) => {
                            console.log(b);
                            return {
                                ...b,
                                dataIndex: `${a.key}${b.key}`,
                                render(text, record) {
                                    return {
                                        props: {
                                            style: {
                                                background:
                                                    record[`${b.key}.bg`],
                                            },
                                        },
                                        children: text,
                                    };
                                },
                            };
                        }),
                    };
                }),
            ],
            properties
        );
    } else {
        return columnTree(
            [
                ...list.slice(0, list.length - 2),
                ...columnTree(list.slice(-2), properties),
            ],
            properties
        );
    }
}
