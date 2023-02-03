import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { useElementSize } from "usehooks-ts";
import { ChartProps } from "../../interfaces";
import { $store } from "../../Store";
import { generateUid } from "../../utils/uid";

interface TableProps extends ChartProps {
  category?: string;
  series?: string;
}

const computeFinancialYears = (year: number) => {
  return [0, 1, 2].map((val) => {
    return { value: `${year + val}July`, key: `FY${year + val}` };
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
      top: "0px",
      h: "50px",
      minH: "50px",
      maxH: "50px",
      zIndex: 2000,
    } as any;
  }
  if (row === 0 && column > 0) {
    return {
      position: "sticky",
      backgroundColor: "white",
      h: "20px",
      minH: "20px",
      maxH: "20px",
      top: "0px",
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
      top: "25px",
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
          <Table variant="simple" colorScheme="orange" w="100%" size="sm">
            <Thead>
              <Tr>
                <Th rowSpan={2} {...otherRows(0, 0)}>
                  Indicator
                </Th>
                {computeFinancialYears(2020).map((fy, index) => (
                  <Th
                    colSpan={3}
                    key={fy.value}
                    {...otherRows(0, index + 1)}
                    textAlign="center"
                  >
                    {fy.key}
                  </Th>
                ))}
              </Tr>
              <Tr>
                {computeFinancialYears(2020)
                  .flatMap(() => [
                    { key: generateUid(), value: "Baseline" },
                    { key: generateUid(), value: "Target" },
                    { key: generateUid(), value: "Actual" },
                  ])
                  .map(({ key, value }, index) => (
                    <Th key={key} {...otherRows(1, index + 1)}>
                      {value}
                    </Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {store.dataElements.map(({ name, id }) => (
                <Tr key={id}>
                  <Td>{name}</Td>
                  {computeFinancialYears(2020)
                    .flatMap((fy) => [
                      {
                        key: generateUid(),
                        value: processed[`${id}${fy.value}bqIaasqpTas`],
                      },
                      {
                        key: generateUid(),
                        value: processed[`${id}${fy.value}Px8Lqkxy2si`],
                      },
                      {
                        key: generateUid(),
                        value: processed[`${id}${fy.value}HKtncMjp06U`],
                      },
                    ])
                    .map(({ key, value }) => (
                      <Td key={`${id}${key}`}>{value}</Td>
                    ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Stack>
  );
};

export default Tables;
