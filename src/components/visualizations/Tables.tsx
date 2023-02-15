import {
  Box,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  SimpleGrid,
  TableCaption,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { fromPairs, groupBy, sum, orderBy } from "lodash";
import { useElementSize } from "usehooks-ts";
import { ChartProps } from "../../interfaces";
import { $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import { updateVisualizationData } from "../../Events";

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

export const innerColumns = (index: number) => {
  if (index === 0) {
    return {
      position: "sticky",
      w: "400px",
      minWidth: "400px",
      maxWidth: "400px",
      left: "0px",
      backgroundColor: "white",
      zIndex: 100,
    } as any;
  }
  // if (index === 1) {
  //   return {
  //     position: "sticky",
  //     w: "250px",
  //     minW: "250px",
  //     maxWidth: "250px",
  //     left: "200px",
  //     backgroundColor: "white",
  //     zIndex: 100,
  //   } as any;
  // }
  return {} as any;
};

const Tables = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
  section,
  data,
}: TableProps) => {
  const store = useStore($store);

  const [squareRef, { width, height }] = useElementSize();

  const processed: { [key: string]: string } = fromPairs(
    data.map((d: any) => [
      `${d.dx || ""}${d.pe || ""}${d.Duw5yep8Vae || ""}`,
      d.value,
    ])
  );

  const processSummaries = () => {
    const elements = store.rows.flatMap((row) => {
      if (row.elements) {
        return row.elements;
      }
      return row.id;
    });

    const filtered = data.filter(({ dx }: any) => elements.indexOf(dx) !== -1);
    const groupedByDx = groupBy(filtered, "dx");
    const all = Object.entries(groupedByDx).map(([dx, dataElementData]) => {
      return Object.entries(groupBy(dataElementData, "pe")).map(
        ([pe, group]) => {
          const actualValue = group.find(
            ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "HKtncMjp06U"
          );
          const targetValue = group.find(
            ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "Px8Lqkxy2si"
          );

          if (actualValue && targetValue) {
            const percentage =
              Number(actualValue.value) / Number(targetValue.value);
            if (percentage >= 1) return "a";
            if (percentage >= 0.75) return "ma";
            return "na";
          }

          return "na";
        }
      );
    });

    const achieved = all.filter((a) => a.indexOf("a") !== -1);
    const moderately = all.filter(
      (a) => a.indexOf("a") === -1 && a.indexOf("ma") !== -1
    );
    const notAchieved = all.filter(
      (a) => a.indexOf("a") === -1 && a.indexOf("ma") === -1
    );

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
      let returnValue: { [key: string]: number } = {};
      Object.entries(groupedByPeriod).forEach(([period, des]) => {
        const groupedByDx = Object.entries(groupBy(des, "dx")).map(
          ([dx, group]) => {
            const actualValue = group.find(
              ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "HKtncMjp06U"
            );
            const targetValue = group.find(
              ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "Px8Lqkxy2si"
            );

            if (actualValue && targetValue) {
              return {
                a:
                  Number(actualValue.value) >= Number(targetValue.value)
                    ? 1
                    : 0,
                b:
                  Number(actualValue.value) <= Number(targetValue.value)
                    ? 1
                    : 0,
                c: 0,
              };
            }

            if (actualValue) {
              return {
                a: 1,
                b: 0,
                c: 0,
              };
            }

            if (targetValue) {
              return {
                a: 0,
                b: 0,
                c: 1,
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
          ...{ [`${period}a`]: a, [`${period}b`]: b, [`${period}c`]: c },
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
                  <Text>Achieved (&gt;= 100% )</Text>
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
                  <Text>Moderately achieved (75-99%)</Text>
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
                  <Text>Not achieved (&lt;75%)</Text>
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
              <Tr h="50px" top="50px" position="sticky" bg="white" zIndex={100}>
                {store.originalColumns.map(({ title, id, w }, col) => (
                  <Th
                    borderColor="#DDDDDD"
                    borderStyle="solid"
                    borderWidth="thin"
                    color="black"
                    // fontSize="lg"
                    key={id}
                    rowSpan={2}
                    // {...otherRows(0, col)}
                    fontWeight="extrabold"
                    w={w}
                  >
                    {title}
                  </Th>
                ))}
                {computeFinancialYears(2020).map((fy, index) => (
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
                    color="black"
                  >
                    {fy.key}
                  </Th>
                ))}
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
                        fontWeight="bold"
                        color="black"
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
                          fontWeight="bold"
                          borderWidth="thin"
                          key={`${id}${row.id}`}
                          w={w}
                        >
                          {col === 0 &&
                          store.selectedDashboard === "emIWijzLHR4"
                            ? `${bigIndex + 1}. ${row[id]}`
                            : row[id]}
                        </Td>
                      )
                    )}
                    {computeFinancialYears(2020)
                      .flatMap((fy) => {
                        if (store.columns.length > 0) {
                          return store.columns.map(({ id: cId }) => {
                            let bg = "";
                            let color = "black";
                            const actual =
                              processed[`${row.id}${fy.value}${cId}`];
                            const target =
                              processed[`${row.id}${fy.value}Px8Lqkxy2si`];

                            if (cId === "HKtncMjp06U" && actual && target) {
                              const percentage =
                                (Number(actual) * 100) / Number(target);
                              if (percentage >= 100) {
                                bg = "green";
                                // color = "white";
                              } else if (percentage >= 75) {
                                bg = "yellow";
                                // color = "white";
                              } else {
                                bg = "red";
                                // color = "white";
                              }
                            } else if (cId === "HKtncMjp06U" && !actual) {
                              bg = "#AAAAAA";
                            }
                            if (cId === "Px8Lqkxy2si" && actual) {
                            } else if (cId === "Px8Lqkxy2si") {
                            }
                            return {
                              key: `${row.id}${fy.value}${cId}`,
                              value:
                                pd[`${fy.value}${cId}`] ||
                                processed[`${row.id}${fy.value}${cId}`],
                              bg,
                              color,
                            };
                          });
                        }

                        const value = processed[`${row.id}${fy.value}`];

                        let bg = "#AAAAAA";
                        let color = "black";
                        if (value) {
                          const realValue = Number(value);
                          if (realValue >= 100) {
                            bg = "green";
                            // color = "white";
                          } else if (realValue >= 75) {
                            bg = "green.500";
                            // color = "white";
                          } else if (realValue >= 49) {
                            bg = "yellow";
                            // color = "white";
                          } else if (realValue >= 25) {
                            bg = "orange";
                            // color = "white";
                          } else if (realValue < 25) {
                            bg = "red";
                            // color = "white";
                          }
                        }
                        return {
                          key: `${row.id}${fy.value}`,
                          value: value,
                          bg,
                          color,
                        };
                      })
                      .map(({ key, value, bg, color }) => (
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
                      ))}
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
