import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { flatten } from "lodash";
import React from "react";
import { useElementSize } from "usehooks-ts";
import { ChartProps, Column, Threshold } from "../../interfaces";
import { SPECIAL_COLUMNS } from "../constants";
import { invertHex, processTable } from "../processors";

interface TableProps extends ChartProps {}

const Tables = ({
    visualization,
    layoutProperties,
    dataProperties,
    section,
    data,
}: TableProps) => {
    const [squareRef, { height }] = useElementSize();
    const flattenedData = flatten(data);

    const rows = String(visualization.properties["rows"] || "").split(",");
    const columns = String(visualization.properties["columns"] || "").split(
        ","
    );
    const thresholds: Threshold[] =
        visualization.properties["data.thresholds"] || [];
    const aggregation = visualization.properties["aggregation"] || "count";
    const aggregationColumn =
        visualization.properties["aggregationColumn"] || "";

    const { finalColumns, finalData, finalRows } = processTable(
        flattenedData,
        rows,
        columns,
        aggregation,
        thresholds,
        aggregationColumn
    );

    const findOthers = (col: Column) => {
        return { bg: visualization.properties[`${col.actual}.bg`] };
    };

    return (
        <Stack w="100%" p="10px" h="100%">
            <Box h="100%" w="100%" ref={squareRef}>
                <Box
                    position="relative"
                    overflow="auto"
                    // whiteSpace="nowrap"
                    h={`${height}px`}
                    w="100%"
                >
                    <Table
                        variant="unstyled"
                        w="100%"
                        bg="white"
                        size={visualization.properties["cellHeight"]}
                        style={{ borderSpacing: 0, borderCollapse: "collapse" }}
                    >
                        {visualization.properties["showHeaders"] && (
                            <Thead>
                                {finalColumns.map((col, index) => (
                                    <Tr key={index}>
                                        {index === 0 && (
                                            <Th
                                                textTransform="none"
                                                borderColor="#DDDDDD"
                                                borderWidth="thin"
                                                fontWeight="extrabold"
                                                borderStyle="solid"
                                                rowSpan={finalColumns.length}
                                                colSpan={finalRows.length}
                                            >
                                                {
                                                    visualization.properties[
                                                        "rowName"
                                                    ]
                                                }
                                            </Th>
                                        )}
                                        {index === 0 &&
                                            columns
                                                .filter(
                                                    (c) =>
                                                        SPECIAL_COLUMNS.indexOf(
                                                            c
                                                        ) !== -1
                                                )
                                                .map((c) => (
                                                    <Th
                                                        textTransform="none"
                                                        fontWeight="extrabold"
                                                        borderColor="#DDDDDD"
                                                        borderWidth="thin"
                                                        borderStyle="solid"
                                                        key={c}
                                                        textAlign={
                                                            visualization
                                                                .properties[
                                                                "columnAlignment"
                                                            ]
                                                        }
                                                        rowSpan={
                                                            finalColumns.length
                                                        }
                                                    >
                                                        {visualization
                                                            .properties[
                                                            `${c}.name`
                                                        ] || c}
                                                    </Th>
                                                ))}
                                        {col.map((col) => (
                                            <Th
                                                bg={
                                                    visualization.properties[
                                                        `${col.actual}.bg`
                                                    ]
                                                }
                                                color={invertHex(
                                                    visualization.properties[
                                                        `${col.actual}.bg`
                                                    ] || "#ffffff",
                                                    true
                                                )}
                                                className="font-bold"
                                                borderColor="#DDDDDD"
                                                borderWidth="thin"
                                                fontWeight="extrabold"
                                                textTransform="none"
                                                borderStyle="solid"
                                                colSpan={col.span}
                                                textAlign={
                                                    visualization.properties[
                                                        "columnAlignment"
                                                    ]
                                                }
                                            >
                                                {visualization.properties[
                                                    `${col.actual}.name`
                                                ] || col.actual}
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </Thead>
                        )}

                        <Tbody>
                            {finalRows.map((rows) => {
                                return rows.map((row, index) => (
                                    <Tr key={row.value}>
                                        {finalRows.map((r) => {
                                            return (
                                                <Td
                                                    key={r[index].value}
                                                    borderColor="#DDDDDD"
                                                    borderWidth="thin"
                                                    borderStyle="solid"
                                                    //bg="blue"
                                                    //fontWeight="extrabold"
                                                >
                                                    {visualization.properties[
                                                        `${r[index].actual}.name`
                                                    ] || r[index].actual}
                                                </Td>
                                            );
                                        })}
                                        {columns
                                            .filter(
                                                (c) =>
                                                    SPECIAL_COLUMNS.indexOf(
                                                        c
                                                    ) !== -1
                                            )
                                            .map((c) => (
                                                <Td
                                                    borderColor="#DDDDDD"
                                                    borderWidth="thin"
                                                    borderStyle="solid"
                                                    key={c}
                                                    textAlign={
                                                        visualization
                                                            .properties[
                                                            "columnAlignment"
                                                        ]
                                                    }
                                                >
                                                    {
                                                        finalData[
                                                            `${row.value}${c}`
                                                        ]?.["value"]
                                                    }
                                                </Td>
                                            ))}
                                        {finalColumns.length > 0 &&
                                            finalColumns[
                                                finalColumns.length - 1
                                            ].map((col) => {
                                                return (
                                                    <Td
                                                        key={col.value}
                                                        borderColor="#DDDDDD"
                                                        borderWidth="thin"
                                                        borderStyle="solid"
                                                        textAlign={
                                                            visualization
                                                                .properties[
                                                                "columnAlignment"
                                                            ]
                                                        }
                                                        {...findOthers(col)}
                                                        // bg={
                                                        //     visualization.properties[`${col.actual}.bg`] || finalData[
                                                        //     `${row.value}${col.value}`
                                                        //     ]?.["bg"]
                                                        // }
                                                        bg={""}
                                                        // color={invertHex(visualization.properties[`${col.actual}.bg`] || finalData[
                                                        //     `${row.value}${col.value}`
                                                        // ]?.["bg"] || "#000000", false)}
                                                    >
                                                        {
                                                            finalData[
                                                                `${row.value}${col.value}`
                                                            ]?.["value"]
                                                        }
                                                        {/* {col.value} */}
                                                    </Td>
                                                );
                                            })}
                                    </Tr>
                                ));
                            })}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Stack>
    );
};

export default Tables;
