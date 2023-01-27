import { Box, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useElementSize } from "usehooks-ts";
import { db } from "../../db";
import { ChartProps } from "../../interfaces";
import { useStore } from "effector-react";
import { $store } from "../../Store";

interface TableProps extends ChartProps {
  category?: string;
  series?: string;
}

const Tables = ({}: TableProps) => {
  const store = useStore($store);
  const dataElements = useLiveQuery(async () => {
    const elements = await db.dataElements
      .where("keyResultAreaCode")
      .anyOf(store.themes)
      .toArray();
    return elements;
  }, [store.themes]);
  const [squareRef, { width, height }] = useElementSize();
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
          <Table variant="striped" colorScheme="teal" w="100%">
            <Thead>
              <Tr>
                <Th>
                  To convert {height}--{width}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataElements?.map(({ name, id }) => (
                <Tr key={id}>
                  <Td>{name}</Td>
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
