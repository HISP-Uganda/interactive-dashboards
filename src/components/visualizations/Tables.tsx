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
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs, groupBy, max, mean, sum } from "lodash";
import { useEffect } from "react";
import { useElementSize } from "usehooks-ts";
import { updateVisualizationData } from "../../Events";
import { ChartProps } from "../../interfaces";
import { $store } from "../../Store";

interface TableProps extends ChartProps {
    category?: string;
    series?: string;
}

const computeFinancialYears = (year: number) => {
    return [0, 1, 2, 3, 4].map((val) => {
        return {
            value: `${year + val}July`,
            key: `${year + val}/${String(year + val + 1).slice(2)}`,
        };
    });
};

const formatter = Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
});

const previousFinancialYear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    if (currentDate.getMonth() <= 6) {
        return `${year - 2}July`;
    }
    return `${year - 1}July`;
};

const Tables = ({ data }: TableProps) => {
    const store = useStore($store);
    const [squareRef, { width, height }] = useElementSize();

    const processed: { [key: string]: string } = fromPairs(
        data.map((d: any) => [
            `${d.dx || ""}${d.pe || ""}${d.Duw5yep8Vae || ""}`,
            d.value,
        ])
    );

    const computeDirectives = (data: any[], elements: string[]) => {
        const groupData = data.filter(
            ({ dx }: any) => elements.indexOf(dx) !== -1
        );
        const value = mean(
            Object.entries(groupBy(groupData, "dx")).map(([dx, group]) => {
                const isDecreasing = store.decreasing.indexOf(dx) !== -1;

                const actualValue = group.find(
                    ({ Duw5yep8Vae, pe }: any) =>
                        Duw5yep8Vae === "HKtncMjp06U" &&
                        pe === previousFinancialYear()
                );
                const targetValue = group.find(
                    ({ Duw5yep8Vae, pe }: any) =>
                        Duw5yep8Vae === "Px8Lqkxy2si" &&
                        pe === previousFinancialYear()
                );
                if (actualValue && targetValue) {
                    return isDecreasing
                        ? (Number(targetValue.value) * 100) /
                              Number(actualValue.value)
                        : (Number(actualValue.value) * 100) /
                              Number(targetValue.value);
                }
                return -1;
            })
        );

        if (value >= 100) return "aa";
        if (value >= 75 && value < 100) return "aav";
        if (value >= 50 && value < 75) return "av";
        if (value >= 25 && value < 50) return "bav";
        if (value !== -1) return "nac";
        return "nodata";
    };

    const processSummaries = () => {
        const elements = store.rows.flatMap((row) => {
            if (row.elements) {
                return row.elements;
            }
            return row.id;
        });

        if (store.rows.length > 0) {
            const first = store.rows[0];
            if (first.child) {
                const grouped = groupBy(store.rows, "interventionCode");
                const processedDir = Object.entries(grouped).map(
                    ([directive, elements]) => {
                        const value = computeDirectives(
                            data,
                            elements.map(({ id }: any) => id)
                        );
                        return value;
                    }
                );
                const aa = processedDir.filter((a) => a === "aa").length;
                const aav = processedDir.filter((a) => a === "aav").length;
                const av = processedDir.filter((a) => a === "av").length;
                const bav = processedDir.filter((a) => a === "bav").length;
                const nac = processedDir.filter((a) => a === "nac").length;

                updateVisualizationData({
                    visualizationId: "aa",
                    data: [{ value: aa }],
                });
                updateVisualizationData({
                    visualizationId: "aav",
                    data: [{ value: aav }],
                });
                updateVisualizationData({
                    visualizationId: "av",
                    data: [{ value: av }],
                });
                updateVisualizationData({
                    visualizationId: "bav",
                    data: [{ value: bav }],
                });
                updateVisualizationData({
                    visualizationId: "nac",
                    data: [{ value: nac }],
                });
            } else {
                const processedDir = store.rows.map(({ elements }) => {
                    return computeDirectives(data, elements);
                });

                const aa = processedDir.filter((a) => a === "aa").length;
                const aav = processedDir.filter((a) => a === "aav").length;
                const av = processedDir.filter((a) => a === "av").length;
                const bav = processedDir.filter((a) => a === "bav").length;
                const nac = processedDir.filter((a) => a === "nac").length;

                updateVisualizationData({
                    visualizationId: "aa",
                    data: [{ value: aa }],
                });
                updateVisualizationData({
                    visualizationId: "aav",
                    data: [{ value: aav }],
                });
                updateVisualizationData({
                    visualizationId: "av",
                    data: [{ value: av }],
                });
                updateVisualizationData({
                    visualizationId: "bav",
                    data: [{ value: bav }],
                });
                updateVisualizationData({
                    visualizationId: "nac",
                    data: [{ value: nac }],
                });
            }
        }

        const filtered = data.filter(
            ({ dx }: any) => elements.indexOf(dx) !== -1
        );
        const groupedByDx = groupBy(filtered, "dx");

        let all = Object.entries(groupedByDx).map(([dx, dataElementData]) => {
            const isDecreasing = store.decreasing.indexOf(dx) !== -1;
            const actualValue = dataElementData.find(
                ({ Duw5yep8Vae, pe }: any) =>
                    Duw5yep8Vae === "HKtncMjp06U" &&
                    pe === previousFinancialYear()
            );
            const targetValue = dataElementData.find(
                ({ Duw5yep8Vae, pe }: any) =>
                    Duw5yep8Vae === "Px8Lqkxy2si" &&
                    pe === previousFinancialYear()
            );

            if (actualValue && targetValue) {
                const value =
                    (Number(actualValue.value) * 100) /
                    Number(targetValue.value);
                if (isDecreasing) {
                    if (value <= 100) return "a";
                    if (value > 100 && value <= 175) return "ma";
                    if (value > 175) return "na";
                } else {
                    if (value >= 100) return "a";
                    if (value >= 75 && value < 100) return "ma";
                    if (value < 175) return "na";
                }
            }
            return "n/a";
        });
        console.log(all);
        const achieved = all.filter((a) => a === "a");
        const moderately = all.filter((a) => a === "ma");
        const notAchieved = all.filter((a) => a === "na");

        updateVisualizationData({
            visualizationId: "a",
            data: [{ value: achieved.length }],
        });
        updateVisualizationData({
            visualizationId: "b",
            data: [{ value: moderately.length }],
        });
        updateVisualizationData({
            visualizationId: "c",
            data: [{ value: notAchieved.length }],
        });
    };

    const processData = (dataElements: string[], child: boolean = false) => {
        if (child) {
            return {};
        } else {
            const filtered = data.filter(
                ({ dx }: any) => dataElements.indexOf(dx) !== -1
            );
            const groupedByPeriod = groupBy(filtered, "pe");
            let returnValue: { [key: string]: any } = {};
            Object.entries(groupedByPeriod).forEach(([period, des]) => {
                const groupedByDx = Object.entries(groupBy(des, "dx")).map(
                    ([dx, group]) => {
                        const isDecreasing =
                            store.decreasing.indexOf(dx) !== -1;
                        const actualValue = group.find(
                            ({ Duw5yep8Vae }: any) =>
                                Duw5yep8Vae === "HKtncMjp06U"
                        );
                        const targetValue = group.find(
                            ({ Duw5yep8Vae }: any) =>
                                Duw5yep8Vae === "Px8Lqkxy2si"
                        );

                        if (actualValue && targetValue) {
                            const percentage = isDecreasing
                                ? Number(targetValue.value) /
                                  Number(actualValue.value)
                                : Number(actualValue.value) /
                                  Number(targetValue.value);
                            return {
                                a: percentage >= 1 ? 1 : 0,
                                b: percentage >= 0.75 && percentage < 1 ? 1 : 0,
                                c: percentage < 0.75 ? 1 : 0,
                            };
                        }

                        return {
                            a: 0,
                            b: 0,
                            c: 0,
                        };
                    }
                );
                const a = sum(groupedByDx.map(({ a }) => a));
                const b = sum(groupedByDx.map(({ b }) => b));
                const c = sum(groupedByDx.map(({ c }) => c));
                returnValue = {
                    ...returnValue,
                    ...{
                        [`${period}a`]: formatter.format(
                            a / dataElements.length
                        ),
                        [`${period}b`]: formatter.format(
                            b / dataElements.length
                        ),
                        [`${period}c`]: formatter.format(
                            c / dataElements.length
                        ),
                        [`${period}d`]: formatter.format(
                            (dataElements.length - (a + b + c)) /
                                dataElements.length
                        ),
                    },
                };
            });
            return returnValue;
        }
    };

    useEffect(() => {
        processSummaries();
    }, [data, store.rows]);

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
                    <Table variant="unstyled" w="100%" bg="white" size="sm">
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
                                    <Text>Moderately achieved</Text>
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
                                    <Text>Not achieved</Text>
                                </Stack>
                                <Stack
                                    h="50px"
                                    fontSize="xl"
                                    // fontWeight="semi-bold"
                                    color="black"
                                    bg="#AAAAAA"
                                    alignItems="center"
                                    alignContent="center"
                                    justifyItems="center"
                                    justifyContent="center"
                                >
                                    <Text>No data</Text>
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
                                {computeFinancialYears(2020).map(
                                    (fy, index) => (
                                        <Th
                                            colSpan={store.columns.length}
                                            key={fy.value}
                                            // {...otherRows(0, index + 1)}
                                            // fontWeight="extrabold"
                                            textAlign="center"
                                            borderColor="#DDDDDD"
                                            borderStyle="solid"
                                            borderWidth="thin"
                                            fontSize="md"
                                            // color="black"
                                        >
                                            {fy.key}
                                        </Th>
                                    )
                                )}
                            </Tr>

                            {store.columns.length > 0 && (
                                <Tr
                                    h="50px"
                                    top="100px"
                                    position="sticky"
                                    zIndex={100}
                                    bg="white"
                                >
                                    {computeFinancialYears(2020)
                                        .flatMap((fy) =>
                                            store.columns.map((c) => {
                                                return {
                                                    ...c,
                                                    id: `${c.id}${fy.value}`,
                                                    bg: c.bg || "",
                                                };
                                            })
                                        )
                                        .map(({ id, title, bg }, index) => (
                                            <Th
                                                borderColor="#DDDDDD"
                                                borderStyle="solid"
                                                borderWidth="thin"
                                                // fontWeight="bold"
                                                // color="black"
                                                fontSize="sm"
                                                bg={bg}
                                                key={id}
                                                // {...otherRows(1, index + 1)}
                                            >
                                                {title}
                                            </Th>
                                        ))}
                                </Tr>
                            )}
                        </Thead>
                        <Tbody>
                            {store.rows.map((row, bigIndex) => {
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
                            })}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Stack>
    );
};

export default Tables;
