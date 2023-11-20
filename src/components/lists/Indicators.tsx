import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    Input,
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
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { indicatorApi } from "../../Events";
import { IIndicator, LocationGenerics } from "../../interfaces";
import { deleteDocument, saveDocument, useNamespace } from "../../Queries";
import { $settings, $store, createIndicator } from "../../Store";
import { generateUid } from "../../utils/uid";
import LoadingIndicator from "../LoadingIndicator";
import PaginatedTable from "./PaginatedTable";
import Scrollable from "../Scrollable";
import TableHeader from "../TableHeader";
import { Popconfirm } from "antd";

const NUMBER_PER_PAGE = 15;

const Indicators = () => {
    const navigate = useNavigate<LocationGenerics>();
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const queryClient = useQueryClient();
    const { isLoading, isSuccess, isError, error, data } =
        useNamespace<IIndicator>("i-indicators", storage, systemId, []);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");
    const [q, setQ] = useState<string>("");
    const [loading2, setLoading2] = useState<boolean>(false);

    const last = currentPage * NUMBER_PER_PAGE;

    const [currentData, setCurrentData] = useState<IIndicator[] | undefined>(
        data
            ?.filter((d) => {
                return (
                    d &&
                    (d.name?.toLowerCase().includes(q.toLowerCase()) ||
                        d.id.includes(q))
                );
            })
            .slice(last - NUMBER_PER_PAGE, last)
    );
    useEffect(() => {
        setCurrentData(() => {
            if (data) {
                return data
                    .filter((d) => {
                        return (
                            d &&
                            (d.name?.toLowerCase().includes(q.toLowerCase()) ||
                                d.id.includes(q))
                        );
                    })
                    .slice(last - NUMBER_PER_PAGE, last);
            }
            return [];
        });
    }, [currentPage, q, data]);

    const deleteResource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-indicators", id, engine);
        setCurrentData((prev) => prev?.filter((p) => p.id !== id));
        setLoading(() => false);
    };
    return (
        <Stack w="100%" h="100%" spacing="20px">
            <Text fontSize="2xl" fontWeight="bold" p="2" color="blue.600">
                Indicators
            </Text>
            <Stack direction="row">
                <Input
                    value={q}
                    placeholder="Search Indicator"
                    width="50%"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setQ(e.target.value)
                    }
                    size="sm"
                />
                <Spacer />
                <Button
                    onClick={() => {
                        const indicator = createIndicator();
                        indicatorApi.setIndicator(indicator);
                        navigate({
                            to: `/settings/indicators/${indicator.id}`,
                            search: { action: "create" },
                        });
                    }}
                    colorScheme="blue"
                    size="sm"
                >
                    <AddIcon mr="2" />
                    Add Indicator
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
                    <Stack spacing="10px" w="100%" h="100%">
                        <Scrollable>
                            <Table variant="striped" size="sm">
                                <TableHeader>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Factor</Th>
                                        <Th>Description</Th>
                                        <Th w="200px">Actions</Th>
                                    </Tr>
                                </TableHeader>
                                <Tbody>
                                    {currentData?.map(
                                        (indicator: IIndicator) => (
                                            <Tr key={indicator.id}>
                                                <Td>
                                                    <Link<LocationGenerics>
                                                        to={`/settings/indicators/${indicator.id}`}
                                                        search={{
                                                            action: "update",
                                                        }}
                                                    >
                                                        {indicator.name}
                                                    </Link>
                                                </Td>
                                                <Td>{indicator.factor}</Td>
                                                <Td>{indicator.description}</Td>
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
                                                        <Button
                                                            size="xs"
                                                            onClick={async () => {
                                                                setCurrentId(
                                                                    () =>
                                                                        indicator.id
                                                                );
                                                                const id =
                                                                    generateUid();
                                                                setLoading2(
                                                                    () => true
                                                                );
                                                                await saveDocument(
                                                                    storage,
                                                                    "i-indicators",
                                                                    systemId,
                                                                    {
                                                                        ...indicator,
                                                                        id,
                                                                    },
                                                                    engine,
                                                                    "create"
                                                                );
                                                                await queryClient.invalidateQueries(
                                                                    [
                                                                        "i-indicators",
                                                                    ]
                                                                );
                                                                setLoading2(
                                                                    () => false
                                                                );
                                                                navigate({
                                                                    to: `/settings/indicators/${id}`,
                                                                    search: {
                                                                        action: "update",
                                                                    },
                                                                });
                                                            }}
                                                            isLoading={
                                                                loading2 &&
                                                                currentId ===
                                                                    indicator.id
                                                            }
                                                        >
                                                            Duplicate
                                                        </Button>

                                                        <Popconfirm
                                                            title="Delete the indicator"
                                                            description="Are you sure to delete this indicator?"
                                                            onConfirm={() =>
                                                                deleteResource(
                                                                    indicator.id
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
                                                                        indicator.id
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Popconfirm>
                                                    </Stack>
                                                </Td>
                                            </Tr>
                                        )
                                    )}
                                </Tbody>
                            </Table>
                        </Scrollable>
                        <PaginatedTable
                            currentPage={currentPage}
                            setNextPage={setCurrentPage}
                            pageSize={NUMBER_PER_PAGE}
                            total={
                                (data &&
                                    data.filter((d) => {
                                        return (
                                            d &&
                                            (d.name
                                                ?.toLowerCase()
                                                .includes(q.toLowerCase()) ||
                                                d.id.includes(q))
                                        );
                                    }).length) ||
                                0
                            }
                        />
                    </Stack>
                )}
                {isError && <Text>No data/Error occurred</Text>}
            </Stack>
        </Stack>
    );
};

export default Indicators;
