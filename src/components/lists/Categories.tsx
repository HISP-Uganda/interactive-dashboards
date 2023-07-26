import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    Spacer,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { Link, useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import { ICategory, LocationGenerics } from "../../interfaces";
import { deleteDocument, useNamespace } from "../../Queries";
import { $settings, $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import LoadingIndicator from "../LoadingIndicator";

const Categories = () => {
    const navigate = useNavigate<LocationGenerics>();
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");

    const { isLoading, isSuccess, isError, error, data } =
        useNamespace<ICategory>("i-categories", storage, systemId, []);
    const [response, setResponse] = useState<ICategory[] | undefined>(data);
    const deleteResource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-categories", id, engine);
        setResponse((prev) => prev?.filter((p) => p.id !== id));
        setLoading(() => false);
    };
    useEffect(() => {
        setResponse(() => data);
    }, [data]);

    return (
        <Stack>
            <Stack direction="row">
                <Text fontSize="2xl" fontWeight="bold" p="2" color="blue.600">
                    Categories
                </Text>
                <Spacer />
                <Button
                    colorScheme="blue"
                    onClick={() =>
                        navigate({
                            to: `/settings/categories/${generateUid()}`,
                            search: {
                                action: "create",
                            },
                        })
                    }
                >
                    <AddIcon mr="2" />
                    Add Category
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
                            {response?.map((category: ICategory) => (
                                <Tr key={category.id}>
                                    <Td>
                                        <Link<LocationGenerics>
                                            to={`/settings/categories/${category.id}`}
                                            search={{ action: "update" }}
                                        >
                                            {category.name}
                                        </Link>
                                    </Td>
                                    <Td>{category.description}</Td>
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
                                                    currentId === category.id
                                                }
                                                onClick={() =>
                                                    deleteResource(category.id)
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

export default Categories;
