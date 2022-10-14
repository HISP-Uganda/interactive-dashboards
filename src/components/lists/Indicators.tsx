import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { setIndicator, setVisualizationQueries } from "../../Events";
import { IIndicator } from "../../interfaces";
import { useVisualizationData } from "../../Queries";
import { $indicators, $store, createIndicator } from "../../Store";
import PaginatedTable from "./PaginatedTable";

const Indicators = () => {
  const navigate = useNavigate();
  const { systemId } = useStore($store);
  const indicators = useStore($indicators);
  const { isLoading, isSuccess, isError, error } =
    useVisualizationData(systemId);
  const [currentPage, setCurrentPage] = useState<number>(2);
  const [data, setData] = useState<IIndicator[]>([]);
  const [q, setQ] = useState<string>("");
  useEffect(() => {
    const last = currentPage * 10;
    setData(
      indicators
        .filter(({ name, id }) => {
          return (
            name?.toLowerCase().includes(q.toLowerCase()) || id.includes(q)
          );
        })
        .slice(last - 10, last)
    );
  }, [currentPage, q]);
  return (
    <Stack bg="white" p="10px">
      <Stack direction="row">
        <Input
          value={q}
          placeholder="Search Visualization Data"
          width="50%"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
        <Spacer />
        <Button
          onClick={() => {
            const indicator = createIndicator();
            setVisualizationQueries([...indicators, indicator]);
            navigate({ to: `/indicators/${indicator.id}` });
          }}
          colorScheme="blue"
        >
          <AddIcon mr="2" />
          Add Visualization Data
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack spacing="10px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Data Source</Th>
                <Th>Factor</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((indicator: IIndicator) => (
                <Tr
                  key={indicator.id}
                  cursor="pointer"
                  onClick={() => {
                    setIndicator(indicator);
                    navigate({
                      to: `/indicators/${indicator.id}`,
                      search: { edit: true },
                    });
                  }}
                >
                  <Td>{indicator.name}</Td>
                  <Td>{indicator.dataSource}</Td>
                  <Td>{indicator.factor}</Td>
                  <Td>{indicator.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <PaginatedTable
            currentPage={currentPage}
            setNextPage={setCurrentPage}
            total={
              indicators.filter(({ name, id }) => {
                return (
                  name?.toLowerCase().includes(q.toLowerCase()) ||
                  id.includes(q)
                );
              }).length
            }
          />
        </Stack>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default Indicators;
