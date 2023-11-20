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
import Scrollable from "../Scrollable";
import { Popconfirm } from "antd";

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
        <Stack w="100%" h="100%">
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
                    size="sm"
                >
                    <AddIcon mr="2" />
                    Add Category
                </Button>
            </Stack>
            <Stack
                justifyItems="center"
                alignContent="center"
                alignItems="center"
                w="100%"
                h="100%"
            >
                {isLoading && <LoadingIndicator />}
                {isSuccess && (
                    <Scrollable>
                        <Table variant="striped" w="100%" size="sm">
                            <Thead
                                position="sticky"
                                top="0"
                                bgColor="white"
                                zIndex={1}
                            >
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Order</Th>
                                    <Th w="200px">Actions</Th>
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
                                        <Td>{category.order}</Td>
                                        <Td>
                                            <Stack
                                                direction="row"
                                                spacing="5px"
                                            >
                                                <Button
                                                    colorScheme="green"
                                                    size="xs"
                                                >
                                                    Edit
                                                </Button>
                                                <Button size="xs">
                                                    Duplicate
                                                </Button>

                                                <Popconfirm
                                                    title="Delete the category"
                                                    description="Are you sure to delete this category?"
                                                    onConfirm={() =>
                                                        deleteResource(
                                                            category.id
                                                        )
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        colorScheme="red"
                                                        size="xs"
                                                        isLoading={
                                                            loading &&
                                                            currentId ===
                                                                category.id
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Popconfirm>
                                            </Stack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Scrollable>
                )}
                {isError && <Text>No data/Error occurred</Text>}
            </Stack>
        </Stack>
    );
};

export default Categories;
