import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { IDataSource } from "../../interfaces";
import { deleteDocument, useDataSources } from "../../Queries";
import { $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import { generalPadding, otherHeight } from "../constants";
const DataSources = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const store = useStore($store);
  const [currentId, setCurrentId] = useState<string>("");
  const { isLoading, isSuccess, isError, error, data } = useDataSources(
    store.systemId
  );
  const [response, setResponse] = useState<IDataSource[] | undefined>(data);
  const deleteDataSource = async (id: string) => {
    setCurrentId(() => id);
    setLoading(() => true);
    await deleteDocument("i-data-sources", id);
    setResponse((prev) => prev?.filter((p) => p.id !== id));
    setLoading(() => false);
  };

  useEffect(() => {
    setResponse(() => data);
  }, [data]);

  return (
    <Stack
      p={`${generalPadding}px`}
      bgColor="white"
      flex={1}
      h={otherHeight}
      maxH={otherHeight}
    >
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
      <Stack
        justifyItems="center"
        alignContent="center"
        alignItems="center"
        flex={1}
      >
        {isLoading && <Spinner />}
        {isSuccess && (
          <Table variant="simple" w="100%">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {response?.map((dataSource: IDataSource) => (
                <Tr key={dataSource.id}>
                  <Td>
                    <Link to={`/data-sources/${dataSource.id}`}>
                      {dataSource.name}
                    </Link>
                  </Td>
                  <Td>{dataSource.description}</Td>
                  <Td>
                    <Stack direction="row" spacing="5px">
                      <Button colorScheme="green" size="xs">
                        Edit
                      </Button>
                      <Button size="xs">Duplicate</Button>
                      <Button
                        colorScheme="red"
                        size="xs"
                        isLoading={loading && currentId === dataSource.id}
                        onClick={() => deleteDataSource(dataSource.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </Stack>
    </Stack>
  );
};

export default DataSources;
