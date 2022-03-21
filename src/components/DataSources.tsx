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
import NewDataSourceDialog from "./NewDataSourceDialog";

const DataSources = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-data-sources");

  return (
    <Stack>
      <Stack direction="row" spacing="10px">
        <NewDataSourceDialog />
        {store.dataSources.length > 0 && (
          <Button onClick={() => navigate({ to: "../categories" })}>
            Categories
          </Button>
        )}
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
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
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default DataSources;
