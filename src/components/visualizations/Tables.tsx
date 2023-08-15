import {
    Box,
    Stack,
    Table,
    Button,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Flex,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { flatten, orderBy } from "lodash";
import React, { useRef } from "react";
import { useElementSize } from "usehooks-ts";
import { ChartProps, Column, Threshold } from "../../interfaces";
import { $visualizationMetadata } from "../../Store";
import { SPECIAL_COLUMNS } from "../constants";
import { invertHex, processTable } from "../processors";
import JsPDF from "jspdf";

interface TableProps extends ChartProps {}

const Tables = ({ visualization, data, dimensions }: TableProps) => {
    const [squareRef, { height }] = useElementSize();
    const tbl = useRef<HTMLTableElement>(null);
    const flattenedData = flatten(data);
    const metadata = useStore($visualizationMetadata)[visualization.id];
    const rows = String(visualization.properties["rows"] || "").split(",");
    const columns = String(visualization.properties["columns"] || "").split(
        ","
    );
    const generatePDF = () => {
        const report = new JsPDF("landscape", "pt", "a1");
        if (tbl.current) {
            report.html(tbl.current).then(() => {
                report.save("report.pdf");
            });
        }
    };
    const thresholds: Threshold[] =
        visualization.properties["data.thresholds"] || [];
    const aggregation = visualization.properties["aggregation"] || "count";
    const aggregationColumn =
        visualization.properties["aggregationColumn"] || "";

    let { finalColumns, finalData, finalRows } = processTable(
        flattenedData,
        rows,
        columns,
        aggregation,
        thresholds,
        aggregationColumn,
        dimensions,
        visualization.properties
    );
    const findOthers = (col: Column) => {
        return { bg: visualization.properties[`${col.actual}.bg`] };
    };

    const findLabel = (data: any) => {
        return metadata?.[data] || data;
    };

    return (
        <Stack w="100%" h="100%" spacing={0}>
            <Flex>
                <Stack h="48px" fontSize="xl">
                    <Button colorScheme="blue" onClick={generatePDF}>
                        Download Table
                    </Button>
                </Stack>
            </Flex>
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
                        ref={tbl}
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
                                                        {findLabel(
                                                            visualization
                                                                .properties[
                                                                `${c}.name`
                                                            ] || c
                                                        )}
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
                                                key={col.value}
                                            >
                                                {findLabel(
                                                    visualization.properties[
                                                        `${col.actual}.name`
                                                    ] || col.actual
                                                )}
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
                                                >
                                                    {findLabel(
                                                        visualization
                                                            .properties[
                                                            `${r[index].actual}.name`
                                                        ] || r[index].actual
                                                    )}
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
                                                            ]?.["bg"] || "white"
                                                        }
                                                        color={invertHex(
                                                            finalData[
                                                                `${row.value}${col.value}`
                                                            ]?.["bg"] ||
                                                                "white",
                                                            true
                                                        )}
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
        </Stack>
    );
};

export default Tables;
