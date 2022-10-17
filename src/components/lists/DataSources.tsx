import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
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
import { setDataSource } from "../../Events";
import { IDataSource } from "../../interfaces";
import { useDataSources } from "../../Queries";
import { $dataSources, $store } from "../../Store";
import { generateUid } from "../../utils/uid";
const DataSources = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error } = useDataSources(
    store.systemId
  );
  const dataSources = useStore($dataSources);

  return (
    <Stack flex={1} p="20px" bg="white">
      <Stack direction="row" border="1">
        <Spacer />
        <Button
          colorScheme="blue"
          onClick={() => navigate({ to: `/data-sources/${generateUid()}` })}
        >
          <AddIcon mr="2" />
          Add Data Source
        </Button>
      </Stack>
      <Divider borderColor="blue.500" />
      {isLoading && <Spinner />}
      {isSuccess && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataSources.map((dataSource: IDataSource) => (
              <Tr
                key={dataSource.id}
                cursor="pointer"
                onClick={() => {
                  setDataSource(dataSource);
                  navigate({
                    to: `/data-sources/${dataSource.id}`,
                    search: { edit: true },
                  });
                }}
              >
                <Td>{dataSource.name}</Td>
                <Td>{dataSource.description}</Td>
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
