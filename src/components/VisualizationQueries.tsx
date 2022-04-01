import {
  Button,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useNavigate } from "react-location";
import { IDataSource } from "../interfaces";
import { useNamespace } from "../Queries";
import { $store } from "../Store";
import { generateUid } from "../utils/uid";

const VisualizationQueries = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, data, error } = useNamespace(
    "i-visualization-queries"
  );
  return (
    <Stack>
      <Stack direction="row" spacing="10px">
        <Button
          onClick={() =>
            navigate({
              to: "./form",
              search: {
                id: generateUid(),
              },
            })
          }
        >
          Add Visualization Query
        </Button>

        {store.dataSources.length > 0 && (
          <Button onClick={() => navigate({ to: "/categories" })}>
            Categories
          </Button>
        )}
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

export default VisualizationQueries;
