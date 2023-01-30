import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useElementSize } from "usehooks-ts";
import { useEffect } from "react";
import { db } from "../../db";
import { ChartProps } from "../../interfaces";
import { useStore } from "effector-react";
import { $store } from "../../Store";
import { setDataElements } from "../../Events";
import { fromPairs } from "lodash";

interface TableProps extends ChartProps {
  category?: string;
  series?: string;
}

const computeFinancialYears = (year: number) => {
  return [0, 1, 2, 3, 4, 5].map((val) => {
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
  // const dataElements = useLiveQuery(async () => {
  //   const elements = await db.dataElements
  //     .where("keyResultAreaCode")
  //     .anyOf(store.themes)
  //     .or("theme")
  //     .anyOf(store.themes)
  //     .or("subKeyResultAreaCode")
  //     .anyOf(store.themes)
  //     .or("interventionCode")
  //     .anyOf(store.themes)
  //     .toArray();
  //   return elements;
  // }, [store.themes]);
  const [squareRef, { width, height }] = useElementSize();

  // useEffect(() => {
  //   setDataElements(dataElements ? dataElements : []);
  // }, [store.dataElements]);

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
                <Th rowSpan={2}>Baseline</Th>
                {computeFinancialYears(2020).map((fy) => (
                  <Th colSpan={2} key={fy.value}>
                    {fy.key}
                  </Th>
                ))}
                <Th rowSpan={2}>Scores</Th>
                <Th rowSpan={2}>Overall Performance</Th>
              </Tr>
              <Tr>
                {computeFinancialYears(2020).map((fy) => (
                  <>
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
                    <Td>0</Td>
                    {computeFinancialYears(2020).map((fy) => (
                      <>
                        <Td key={fy.value}>
                          {processed[`${id}${fy.value}Px8Lqkxy2si`]}
                        </Td>
                        <Td key={fy.key}>
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
