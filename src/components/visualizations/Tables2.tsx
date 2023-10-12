import {
    Box,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Flex,
    Button,
} from "@chakra-ui/react";
import JsPDF from "jspdf";
import { flatten } from "lodash";
import React, { useRef } from "react";
import { useElementSize } from "usehooks-ts";
import {
    ChartProps,
    Column,
    Threshold,
    LocationGenerics,
} from "../../interfaces";
import { SPECIAL_COLUMNS } from "../constants";
import { invertHex, processTable } from "../processors";
import { useSearch } from "@tanstack/react-location";

interface TableProps extends ChartProps {}

const Tables2 = ({ visualization, data, dimensions }: TableProps) => {
    const [squareRef, { height, width }] = useElementSize();
    const tbl = useRef<HTMLTableElement>(null);
    const flattenedData = flatten(data);
    const rows = String(visualization.properties?.["rows"] ?? "").split(",");
    const columns = String(visualization.properties?.["columns"] ?? "").split(
        ","
    );
    const generatePDF = () => {
        if (tbl.current) {
            const report = new JsPDF(
                "landscape",
                "px",
                [width + 60, height],
                true
            );
            report
                .html(tbl.current, { autoPaging: true, margin: 20 })
                .then(() => {
                    report.save("report.pdf");
                });
        }
    };
    const { display } = useSearch<LocationGenerics>();
    const thresholds: Threshold[] =
        visualization.properties?.["data.thresholds"] ?? [];
    const aggregation = visualization.properties?.["aggregation"] ?? "count";
    const aggregationColumn =
        visualization.properties?.["aggregationColumn"] ?? "";

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
        return data;
    };

    return (
        <Stack w="100%" h="100%" spacing={0}>
            <Flex>
                <Stack h="48px" fontSize="xl">
                    <Button colorScheme="blue" onClick={() => generatePDF()}>
                        Download Table
                    </Button>
                </Stack>
            </Flex>
            <Box h="100%" w="100%" ref={squareRef}>
                <Box
                    position="relative"
                    overflow="auto"
                    // whiteSpace="nowrap"
                    h={display === "dashboard" ? `${height}px` : "100%"}
                    w="100%"
                >
                    <Table
                        variant="unstyled"
                        w="100%"
                        bg="white"
                        size={visualization.properties?.["cellHeight"] || "sm"}
                        ref={tbl}
                        // height={height}
                    >
                        {visualization.properties?.["showHeaders"] && (
                            <Thead
                                position="sticky"
                                top={0}
                                left={0}
                                zIndex={10}
                                bgColor="white"
                                overflow="hidden"
                            >
                                {finalColumns.map((col, index) => (
                                    <Tr key={index} className="stickyth">
                                        {index === 0 && (
                                            <>
                                                {rows.map((row) => (
                                                    <Th
                                                        textTransform="none"
                                                        borderColor="#DDDDDD"
                                                        borderWidth="thin"
                                                        fontWeight="extrabold"
                                                        borderStyle="solid"
                                                        rowSpan={
                                                            finalColumns.length
                                                        }
                                                        key={`${row}${col[0].key}`}
                                                    >
                                                        {findLabel(
                                                            visualization
                                                                .properties[
                                                                `${row}.name`
                                                            ] || row
                                                        )}
                                                    </Th>
                                                ))}
                                            </>
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
                                                    ] || "center"
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
                            {finalRows[finalRows.length - 1].map(
                                (row, index) => {
                                    const currentKey = row.key.split("--");
                                    let display: React.ReactNode = null;
                                    for (let i = 0; i < finalRows.length; i++) {
                                        if (
                                            index % finalRows[i][0].span ===
                                            0
                                        ) {
                                            display = (
                                                <React.Fragment key={i}>
                                                    {finalRows
                                                        .slice(i)
                                                        .map((i1, iw) => {
                                                            const key =
                                                                currentKey[
                                                                    finalRows.length -
                                                                        finalRows.slice(
                                                                            i
                                                                        )
                                                                            .length +
                                                                        iw
                                                                ];
                                                            return (
                                                                <Td
                                                                    borderColor="#DDDDDD"
                                                                    borderWidth="thin"
                                                                    borderStyle="solid"
                                                                    key={`${i}${key}`}
                                                                    verticalAlign="middle"
                                                                    bg={
                                                                        visualization
                                                                            .properties[
                                                                            `${key}.bg`
                                                                        ]
                                                                    }
                                                                    color={invertHex(
                                                                        visualization
                                                                            .properties[
                                                                            `${key}.bg`
                                                                        ] ||
                                                                            "#ffffff",
                                                                        true
                                                                    )}
                                                                    rowSpan={
                                                                        i1[i]
                                                                            .span
                                                                    }
                                                                >
                                                                    {visualization
                                                                        .properties[
                                                                        `${key}.name`
                                                                    ] || key}
                                                                </Td>
                                                            );
                                                        })}
                                                </React.Fragment>
                                            );
                                            break;
                                        }
                                    }
                                    return (
                                        <Tr>
                                            {display}
                                            {columns
                                                .filter(
                                                    (c) =>
                                                        SPECIAL_COLUMNS.indexOf(
                                                            c
                                                        ) !== -1
                                                )
                                                .map((c) => (
                                                    <Td
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
                                                            key={
                                                                col.value +
                                                                row.key
                                                            }
                                                            borderColor="#DDDDDD"
                                                            borderWidth="thin"
                                                            borderStyle="solid"
                                                            textAlign={
                                                                visualization
                                                                    .properties[
                                                                    "columnAlignment"
                                                                ] || "center"
                                                            }
                                                            verticalAlign="middle"
                                                            {...findOthers(col)}
                                                            bg={
                                                                finalData[
                                                                    `${row.value}${col.value}`
                                                                ]?.["bg"] ||
                                                                "white"
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
                                    );
                                }
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Stack>
    );
};

export default Tables2;
