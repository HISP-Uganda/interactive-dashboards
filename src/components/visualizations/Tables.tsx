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

const otherRows = (row: number, column: number, bg: string = "white") => {
  if (row === 0 && column === 0) {
    return {
      position: "sticky",
      backgroundColor: "white",
      w: "400px",
      minWidth: "400px",
      maxWidth: "400px",
      left: "0px",
      top: "60px",
      h: "50px",
      minH: "50px",
      maxH: "50px",
      zIndex: 4000,
    } as any;
  }
  if (row === 0 && column > 0) {
    return {
      position: "sticky",
      backgroundColor: "white",
      h: "20px",
      minH: "20px",
      maxH: "20px",
      top: "60px",
      zIndex: 2000,
    } as any;
  }

  if (row === 1 && column > 0) {
    return {
      position: "sticky",
      backgroundColor: "white",
      h: "20px",
      minH: "20px",
      maxH: "20px",
      top: "100px",
      zIndex: 2000,
    } as any;
  }
  return {
    top: "0px",
    position: "sticky",
    bg,
    // textAlign: "center",
    zIndex: 1000,
  } as any;
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
    data.map((d: any) => [`${d.dx}${d.pe}${d.Duw5yep8Vae}`, d.value])
  );

  const processSummaries = () => {
    const groupedByDx = Object.entries(groupBy(data, "dx")).map(
      ([de, elements]) => {
        const actualValue = orderBy(elements, ["pe"], ["desc"]).find(
          ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "HKtncMjp06U"
        );
        const targetValue = orderBy(elements, ["pe"], ["desc"]).find(
          ({ Duw5yep8Vae }: any) => Duw5yep8Vae === "Px8Lqkxy2si"
        );

        if (actualValue && targetValue) {
          return {
            a: Number(actualValue.value) >= Number(targetValue.value) ? 1 : 0,
            b: Number(actualValue.value) <= Number(targetValue.value) ? 1 : 0,
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

    updateVisualizationData({
      visualizationId: "a",
      data: [{ value: a }],
    });
    updateVisualizationData({
      visualizationId: "b",
      data: [{ value: b }],
    });
    updateVisualizationData({
      visualizationId: "c",
      data: [{ value: c }],
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
  }, [data]);

  return (
    <Stack w="100%" p="10px" h="100%">
      <Box h="100%" w="100%" ref={squareRef}>
        <Box
          position="relative"
          overflow="auto"
          // whiteSpace="nowrap"
          h={`${height}`}
          w="100%"
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
              fontSize="2xl"
              fontWeight="semi-bold"
              bg="#398E3D"
              alignItems="center"
              alignContent="center"
              justifyItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="extrabold">Achieved (&gt;= 100% )</Text>
            </Stack>
            <Stack
              h="50px"
              fontSize="2xl"
              fontWeight="semi-bold"
              bg="#F1BD19"
              alignItems="center"
              alignContent="center"
              justifyItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="extrabold">Moderately achieved (75-99%)</Text>
            </Stack>
            <Stack
              h="50px"
              fontSize="2xl"
              fontWeight="semi-bold"
              bg="red.500"
              alignItems="center"
              alignContent="center"
              justifyItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="extrabold">Not achieved (&lt;75%)</Text>
            </Stack>
            <Stack
              h="50px"
              fontSize="2xl"
              fontWeight="semi-bold"
              bg="#CACBCC"
              alignItems="center"
              alignContent="center"
              justifyItems="center"
              justifyContent="center"
            >
              <Text fontWeight="extrabold">No data</Text>
            </Stack>
          </SimpleGrid>
          <Table  w="100%" colorScheme='teal'>
            <Thead>
              <Tr>
                {store.originalColumns.map(({ title, id, w }, col) => (
                  <Th
                    borderColor="#DDDDDD"
                    borderStyle="solid"
                    borderWidth="thin"
                    color="black"
                    fontSize="lg"
                    key={id}
                    rowSpan={2}
                    {...otherRows(0, col)}
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
                    {...otherRows(0, index + 1)}
                    fontWeight="extrabold"
                    textAlign="center"
                    borderColor="#DDDDDD"
                    fontSize="md"
                    borderStyle="solid"
                    color="black"
                    borderWidth="thin"
                  >
                    {fy.key}
                  </Th>
                ))}
              </Tr>
              <Tr>
                {computeFinancialYears(2020)
                  .flatMap((fy) =>
                    store.columns.map((c) => {
                      return { ...c, id: `${c.id}${fy.value}` };
                    })
                  )
                  .map(({ id, title }, index) => (
                    <Th
                      borderColor="#DDDDDD"
                      borderStyle="solid"
                      borderWidth="thin"
                      fontWeight="bold"
                      color="black"
                      fontSize="sm"
                      key={id}
                      {...otherRows(1, index + 1)}
                    >
                      {title}
                    </Th>
                  ))}
              </Tr>
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
                          borderWidth="thin"
                          key={`${id}${row.id}`}
                          w={w}
                        >
                          {col === 0 ? `${bigIndex + 1}. ${row[id]}` : row[id]}
                        </Td>
                      )
                    )}
                    {computeFinancialYears(2020)
                      .flatMap((fy) =>
                        store.columns.map(({ id: cId }) => {
                          let bg = "";
                          let color = "";
                          const actual =
                            processed[`${row.id}${fy.value}${cId}`];
                          const target =
                            processed[`${row.id}${fy.value}Px8Lqkxy2si`];

                          if (cId === "HKtncMjp06U" && actual && target) {
                            const percentage =
                              (Number(actual) * 100) / Number(target);
                            if (percentage >= 100) {
                              bg = "#398E3D";
                              // color = "white";
                            } else if (percentage >= 75) {
                              bg = "yellow.300";
                              // color = "white";
                            } else {
                              bg = "red.400";
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
                        })
                      )
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
