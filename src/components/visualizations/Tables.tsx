import React, { useRef } from "react";
import { utils, writeFile } from "xlsx";
import {
    Box,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    background,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { flatten, fromPairs, groupBy, max, mean, sum } from "lodash";
import { useElementSize } from "usehooks-ts";
import { ChartProps, Column, Threshold } from "../../interfaces";
import { $store } from "../../Store";
import { createOptions } from "../../utils/utils";
import { processTable, invertHex } from "../processors";
import { SPECIAL_COLUMNS } from "../constants";
import { visualizationDataApi } from "../../Events";

interface TableProps extends ChartProps {}

const getColumns = (data: any[]) => {
    if (data.length > 0) {
        return createOptions(Object.keys(data[0]));
    }
    return [];
};

const previousFinancialYear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    if (currentDate.getMonth() <= 6) {
        return `${year - 2}July`;
    }
    return `${year - 1}July`;
};

const Tables = ({
    visualization,
    layoutProperties,
    dataProperties,
    section,
    data,
}: TableProps) => {
    const store = useStore($store);
    const tbl = useRef(null);
    const [squareRef, { width, height }] = useElementSize();
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
                        // variant="unstyled"
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
                                                //bg="yellow.200"
                                                textAlign={
                                                    visualization.properties[
                                                        "columnAlignment"
                                                    ]
                                                }
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
