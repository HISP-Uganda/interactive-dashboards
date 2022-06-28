import {
  Button,
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
import { setIndicator, setVisualizationQueries } from "../../Events";
import { IIndicator } from "../../interfaces";
import { useVisualizationData } from "../../Queries";
import { $indicators, createIndicator } from "../../Store";

const Indicators = () => {
  const navigate = useNavigate();
  const indicators = useStore($indicators);
  const { isLoading, isSuccess, isError, error } = useVisualizationData();
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Spacer />
        <Button
          onClick={() => {
            const indicator = createIndicator();
            setVisualizationQueries([...indicators, indicator]);
            navigate({ to: `/indicators/${indicator.id}` });
          }}
        >
          Add Visualization Data
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack direction="row" spacing="10px">
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
              {indicators.map((indicator: IIndicator) => (
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
        </Stack>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default Indicators;
