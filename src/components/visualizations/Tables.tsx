import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { flatten } from "lodash";
import { useElementSize } from "usehooks-ts";
import { ChartProps, Column, Threshold } from "../../interfaces";
import { $store } from "../../Store";
import { createOptions } from "../../utils/utils";
import { processTable } from "../processors";
import { SPECIAL_COLUMNS } from "../constants";

interface TableProps extends ChartProps {}

const getColumns = (data: any[]) => {
    if (data.length > 0) {
        return createOptions(Object.keys(data[0]));
    }
    return [];
};

const Tables = ({
    visualization,
    layoutProperties,
    dataProperties,
    section,
    data,
}: TableProps) => {
    const store = useStore($store);
    const [squareRef, { width, height }] = useElementSize();
    const flattenedData = flatten(data);

    const rows = String(visualization.properties["rows"] || "").split(",");
    const columns = String(visualization.properties["columns"] || "").split(
        ","
    );
    const thresholds: Threshold[] =
        visualization.properties["data.thresholds"] || [];
    const aggregation = visualization.properties["aggregation"] || "count";

    const { finalColumns, finalData, finalRows } = processTable(
        flattenedData,
        rows,
        columns,
        aggregation,
        thresholds
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
                                                borderColor="#DDDDDD"
                                                borderWidth="thin"
                                                borderStyle="solid"
                                                rowSpan={finalColumns.length}
                                                colSpan={finalRows.length}
                                                bg="yellow.200"
                                                textAlign={
                                                    visualization.properties[
                                                        "columnAlignment"
                                                    ]
                                                }
                                            ></Th>
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
                                                borderColor="#DDDDDD"
                                                borderWidth="thin"
                                                borderStyle="solid"
                                                colSpan={col.span}
                                                textAlign={
                                                    visualization.properties[
                                                        "columnAlignment"
                                                    ]
                                                }
                                            >
                                                {col.actual}
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
                                                    textAlign={
                                                        visualization
                                                            .properties[
                                                            "columnAlignment"
                                                        ]
                                                    }
                                                >
                                                    {r[index].actual}
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
                                                        bg={
                                                            finalData[
                                                                `${row.value}${col.value}`
                                                            ]?.["bg"]
                                                        }
                                                        color={
                                                            finalData[
                                                                `${row.value}${col.value}`
                                                            ]?.["color"]
                                                        }
                                                    >
                                                        {
                                                            finalData[
                                                                `${row.value}${col.value}`
                                                            ]?.["value"]
                                                        }
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
            <pre>{JSON.stringify(visualization.properties, null, 2)}</pre>
        </Stack>
    );
};

export default Tables;
