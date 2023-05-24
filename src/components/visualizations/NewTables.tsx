import {
    Box,
    SimpleGrid,
    Stack,
    Table,
    TableCaption,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Button,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs, groupBy, max, mean, sum } from "lodash";
import { useEffect } from "react";
import { updateVisualizationData } from "../../Events";
import { ChartProps } from "../../interfaces";
import { $store } from "../../Store";
import { utils, writeFile } from "xlsx";
import React, { useRef } from "react";
import { useElementSize } from "usehooks-ts";

interface TableProps extends ChartProps {
    category?: string;
    series?: string;
}

const NewTables = ({ data }: TableProps) => {
    const tbl = useRef(null);
    const store = useStore($store);
    const [squareRef, { width, height }] = useElementSize();
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
                        size="sm"
                        ref={tbl}
                    >
                        <TableCaption
                            placement="top"
                            bg="white"
                            p={0}
                            m={0}
                            h="50px"
                            top="0px"
                            position="sticky"
                            zIndex={100}
                        >
                            <SimpleGrid
                                columns={4}
                                gap="2px"
                                alignItems="center"
                                zIndex="1000000"
                                bg="white"
                                top="0"
                                position="sticky"
                            >
                                <Stack
                                    h="50px"
                                    fontSize="xl"
                                    // fontWeight="semi-bold"
                                    color="black"
                                    // bg="#398E3D"
                                    bg="green"
                                    alignItems="center"
                                    alignContent="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                >
                                    <Text>Achieved</Text>
                                </Stack>
                                <Stack
                                    h="50px"
                                    fontSize="xl"
                                    // fontWeight="semi-bold"
                                    color="black"
                                    bg="yellow"
                                    alignItems="center"
                                    alignContent="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                >
                                    <Text>On track to be Achieved</Text>
                                </Stack>
                                <Stack
                                    h="50px"
                                    fontSize="xl"
                                    // fontWeight="semi-bold"
                                    color="black"
                                    bg="red"
                                    alignItems="center"
                                    alignContent="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                >
                                    <Text>Actions with slow progress</Text>
                                </Stack>

                                <Stack
                                    h="50px"
                                    fontSize="xl"
                                    // fontWeight="semi-bold"
                                    color="black"
                                    //bg="#AAAAAA"
                                    alignItems="center"
                                    alignContent="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                >
                                    <Button
                                        colorScheme="blue"
                                        onClick={() => {
                                            const wb = utils.table_to_book(
                                                tbl.current
                                            );
                                            writeFile(wb, "Table.xlsx");
                                        }}
                                    >
                                        Download Table as excel
                                    </Button>
                                </Stack>
                            </SimpleGrid>
                        </TableCaption>
                        <Thead>
                            <Tr
                                h="50px"
                                top="50px"
                                position="sticky"
                                bg="white"
                                zIndex={100}
                            >
                                {store.originalColumns.map(
                                    ({ title, id, w }, col) => (
                                        <Th
                                            borderColor="#DDDDDD"
                                            borderStyle="solid"
                                            borderWidth="thin"
                                            // color="black"
                                            // fontSize="lg"
                                            key={id}
                                            rowSpan={2}
                                            // {...otherRows(0, col)}
                                            fontWeight="extrabold"
                                            w={w}
                                        >
                                            {title}
                                        </Th>
                                    )
                                )}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {/* {store.rows.map((row, bigIndex) => {
                                const pd = processData(row.elements, row.child);
                                return (
                                    <Tr key={row.id}>
                                        {store.originalColumns.map(
                                            ({ title, id, type, w }, col) => (
                                                <Td
                                                    borderColor="#DDDDDD"
                                                    borderStyle="solid"
                                                    // fontWeight="bold"
                                                    borderWidth="thin"
                                                    key={`${id}${row.id}`}
                                                    w={w}
                                                >
                                                    {col === 0 &&
                                                        store.selectedDashboard ===
                                                        "emIWijzLHR4"
                                                        ? `${bigIndex + 1}. ${
                                                        row[id]
                                                        }`
                                                        : row[id]}
                                                </Td>
                                            )
                                        )}
                                        {computeFinancialYears(2020)
                                            .flatMap((fy) => {
                                                if (store.columns.length > 0) {
                                                    return store.columns.map(
                                                        ({ id: cId }) => {
                                                            let bg = "";
                                                            let color = "black";
                                                            const actual =
                                                                processed[
                                                                `${row.id}${fy.value}${cId}`
                                                                ];
                                                            const target =
                                                                processed[
                                                                `${row.id}${fy.value}Px8Lqkxy2si`
                                                                ];

                                                            if (
                                                                cId ===
                                                                "HKtncMjp06U" &&
                                                                actual &&
                                                                target
                                                            ) {
                                                                const isDecreasing =
                                                                    store.decreasing.indexOf(
                                                                        row.id
                                                                    ) !== -1;
                                                                const percentage =
                                                                    (Number(
                                                                        actual
                                                                    ) *
                                                                        100) /
                                                                    Number(
                                                                        target
                                                                    );
                                                                if (
                                                                    isDecreasing
                                                                ) {
                                                                    if (
                                                                        percentage >=
                                                                        175
                                                                    ) {
                                                                        bg =
                                                                            "red";
                                                                        // color = "white";
                                                                    } else if (
                                                                        percentage >=
                                                                        101
                                                                    ) {
                                                                        bg =
                                                                            "yellow";
                                                                        // color = "white";
                                                                    } else {
                                                                        bg =
                                                                            "green";
                                                                        // color = "white";
                                                                    }
                                                                } else {
                                                                    if (
                                                                        percentage >=
                                                                        100
                                                                    ) {
                                                                        bg =
                                                                            "green";
                                                                        // color = "white";
                                                                    } else if (
                                                                        percentage >=
                                                                        75
                                                                    ) {
                                                                        bg =
                                                                            "yellow";
                                                                        // color = "white";
                                                                    } else {
                                                                        bg =
                                                                            "red";
                                                                        // color = "white";
                                                                    }
                                                                }
                                                            } else if (
                                                                cId ===
                                                                "HKtncMjp06U" &&
                                                                !actual
                                                            ) {
                                                                bg = "#AAAAAA";
                                                            }
                                                            if (
                                                                cId ===
                                                                "Px8Lqkxy2si" &&
                                                                actual
                                                            ) {
                                                            } else if (
                                                                cId ===
                                                                "Px8Lqkxy2si"
                                                            ) {
                                                            }
                                                            return {
                                                                key: `${row.id}${fy.value}${cId}`,
                                                                value:
                                                                    pd[
                                                                    `${fy.value}${cId}`
                                                                    ] ||
                                                                    processed[
                                                                    `${row.id}${fy.value}${cId}`
                                                                    ],
                                                                bg,
                                                                color,
                                                            };
                                                        }
                                                    );
                                                }

                                                const value =
                                                    processed[
                                                    `${row.id}${fy.value}`
                                                    ];

                                                let bg = "#AAAAAA";
                                                let color = "black";
                                                if (value) {
                                                    const realValue =
                                                        Number(value);
                                                    if (realValue >= 100) {
                                                        bg = "green";
                                                    } else if (
                                                        realValue >= 75
                                                    ) {
                                                        bg = "yellow";
                                                    } else if (realValue < 75) {
                                                        bg = "red";
                                                    }
                                                }
                                                return {
                                                    key: `${row.id}${fy.value}`,
                                                    value: value,
                                                    bg,
                                                    color,
                                                };
                                            })
                                            .map(
                                                ({ key, value, bg, color }) => (
                                                    <Td
                                                        borderColor="#DDDDDD"
                                                        borderStyle="solid"
                                                        borderWidth="thin"
                                                        key={key}
                                                        bg={bg}
                                                        color={color}
                                                        // fontWeight="bold"
                                                        textAlign="center"
                                                    >
                                                        {value}
                                                    </Td>
                                                )
                                            )}
                                    </Tr>
                                );
                            })} */}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Stack>
    );
};

export default NewTables;
