import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { useElementSize } from "usehooks-ts";
import { ChartProps } from "../../interfaces";
import { $store } from "../../Store";

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
          whiteSpace="nowrap"
          h={`${height}`}
          w="100%"
        >
          <Table variant="striped" colorScheme="orange" w="100%">
            <Thead>
              <Tr>
                {/* <Th rowSpan={2}>Key Result Area</Th>
                <Th rowSpan={2}>Sub Key Result Area</Th>
                <Th rowSpan={2}>Intervention</Th> */}
                <Th rowSpan={2}>Indicator</Th>
                {/* <Th rowSpan={2}>Baseline</Th> */}
                {computeFinancialYears(2020).map((fy) => (
                  <Th colSpan={3} key={fy.value} textAlign="center">
                    {fy.key}
                  </Th>
                ))}
                <Th rowSpan={2}>Scores</Th>
                <Th rowSpan={2}>Overall Performance</Th>
              </Tr>
              <Tr>
                {computeFinancialYears(2020).map((fy) => (
                  <>
                    <Th>Baseline</Th>
                    <Th>Target</Th>
                    <Th>Actual</Th>
                  </>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {store.dataElements.map(
                ({
                  name,
                  id,
                  intervention,
                  keyResultArea,
                  subKeyResultArea,
                }) => (
                  // <Tr key={id}>
                  //   <Td>{name}</Td>
                  // </Tr>
                  <Tr key={id}>
                    {/* <Td>{keyResultArea}</Td>
                    <Td>{subKeyResultArea}</Td>
                    <Td>{intervention}</Td> */}
                    <Td>{name}</Td>
                    {computeFinancialYears(2020).map((fy) => (
                      <>
                        <Td>{processed[`${id}${fy.value}bqIaasqpTas`]}</Td>
                        <Td key={fy.value} textAlign="center">
                          {processed[`${id}${fy.value}Px8Lqkxy2si`]}
                        </Td>
                        <Td key={fy.key} textAlign="center">
                          {processed[`${id}${fy.value}HKtncMjp06U`]}
                        </Td>
                      </>
                    ))}
                    <Td></Td>
                    <Td></Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Stack>
  );
};

export default Tables;
