import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import {
    Button,
    Divider,
    Spacer,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { IDataSource, LocationGenerics } from "../../interfaces";
import { deleteDocument, useDataSources } from "../../Queries";
import { $store, $settings } from "../../Store";
import { generateUid } from "../../utils/uid";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import { useDataEngine } from "@dhis2/app-runtime";
const DataSources = () => {
    const navigate = useNavigate<LocationGenerics>();
    const [loading, setLoading] = useState<boolean>(false);
    const store = useStore($store);
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const [currentId, setCurrentId] = useState<string>("");
    const { isLoading, isSuccess, isError, error, data } = useDataSources(
        storage,
        store.systemId
    );
    const [response, setResponse] = useState<IDataSource[] | undefined>(data);
    const deleteDataSource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-data-sources", id, engine);
        setResponse((prev) => prev?.filter((p) => p.id !== id));
        setLoading(() => false);
    };

    useEffect(() => {
        setResponse(() => data);
    }, [data]);

    return (
        <Stack>
            <Stack direction="row" border="1">
                <Spacer />
                <Button
                    colorScheme="blue"
                    onClick={() =>
                        navigate({
                            to: `/settings/data-sources/${generateUid()}`,
                            search: { action: "create" },
                        })
                    }
                >
                    <AddIcon mr="2" />
                    Add Data Source
                </Button>
            </Stack>
            <Stack
                justifyItems="center"
                alignContent="center"
                alignItems="center"
                flex={1}
            >
                {isLoading && <LoadingIndicator />}
                {isSuccess && (
                    <Table variant="striped" w="100%">
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
                                        <Link<LocationGenerics>
                                            to={`/settings/data-sources/${dataSource.id}`}
                                            search={{ action: "update" }}
                                        >
                                            {dataSource.name}
                                        </Link>
                                    </Td>
                                    <Td>{dataSource.description}</Td>
                                    <Td>
                                        <Stack direction="row" spacing="5px">
                                            <Button
                                                colorScheme="green"
                                                size="xs"
                                            >
                                                Edit
                                            </Button>
                                            <Button size="xs">Duplicate</Button>
                                            <Button
                                                colorScheme="red"
                                                size="xs"
                                                isLoading={
                                                    loading &&
                                                    currentId === dataSource.id
                                                }
                                                onClick={() =>
                                                    deleteDataSource(
                                                        dataSource.id
                                                    )
                                                }
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
                {isError && <Text>No data/Error occurred</Text>}
            </Stack>
        </Stack>
    );
};

export default DataSources;
