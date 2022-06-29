import { useEffect } from "react";
import {
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useNavigate } from "@tanstack/react-location";
import { IDataSource } from "../../interfaces";
import { useDataSources } from "../../Queries";
import { $dataSources } from "../../Store";
import { setDataSource, setShowSider } from "../../Events";
import { generateUid } from "../../utils/uid";
const DataSources = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, error } = useDataSources();
  const dataSources = useStore($dataSources);
  useEffect(() => {
    setShowSider(true);
  }, []);
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Spacer />
        <Button
          onClick={() => navigate({ to: `/data-sources/${generateUid()}` })}
        >
          Add Data Source
        </Button>
      </Stack>
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
