import {
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { IDataSource } from "../interfaces";
import { useNamespace } from "../Queries";

const Indicators = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, data, error } = useNamespace(
    "i-visualization-queries"
  );
  return (
    <Stack flex={1} p="10px">
      <Stack direction="row">
        <Spacer />{" "}
        <Button onClick={() => navigate({ to: "/indicators/form" })}>
          Add Visualization Data
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack direction="row" spacing="10px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((dataSource: IDataSource) => (
                <Tr key={dataSource.id}>
                  <Td>{dataSource.id}</Td>
                  <Td>{dataSource.name}</Td>
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
