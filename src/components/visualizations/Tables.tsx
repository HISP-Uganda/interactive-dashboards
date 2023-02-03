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
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { useElementSize } from "usehooks-ts";
import { GroupBase, Select } from "chakra-react-select";
import { ChartProps, Option } from "../../interfaces";
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
          <Table variant="striped" colorScheme="orange" w="100%">
            <Thead>
              <Tr>
                <Th rowSpan={2} maxW="400px" w="400px">
                  Indicator
                </Th>
                {computeFinancialYears(2020).map((fy) => (
                  <Th colSpan={3} key={fy.value} textAlign="center">
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
                  .map(({ key, value }) => (
                    <Th key={key}>{value}</Th>
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
