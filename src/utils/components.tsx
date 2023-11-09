import { Box, Stack, Text } from "@chakra-ui/react";
import { ColumnsType } from "antd/es/table";
import { chakraComponents, GroupBase, OptionProps } from "chakra-react-select";
import { invertHex } from "../components/processors";
import { Option } from "../interfaces";

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
                    onHeaderCell: () => {
                        return {
                            style: {
                                backgroundColor: properties[`${a.key}.bg`],
                            },
                        };
                    },
                    onCell: (cell) => {
                        return {
                            style: {
                                backgroundColor: cell[`${a.key}bg`],
                                color: invertHex(cell[`${a.key}bg`], true),
                            },
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
                            return {
                                ...b,
                                dataIndex: `${a.key}${b.key}`,
                                onHeaderCell: () => {
                                    return {
                                        style: {
                                            backgroundColor:
                                                properties[`${b.key}.bg`],
                                        },
                                    };
                                },
                                onCell: (cell) => {
                                    return {
                                        style: {
                                            backgroundColor: cell[`${a.key}bg`],
                                            color: invertHex(
                                                cell[`${a.key}bg`],
                                                true
                                            ),
                                        },
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
