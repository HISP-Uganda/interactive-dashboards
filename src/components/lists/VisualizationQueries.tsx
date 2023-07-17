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
import { IData, LocationGenerics } from "../../interfaces";
import { deleteDocument, saveDocument, useNamespace } from "../../Queries";
import { $settings, $store, createVisualizationQuery } from "../../Store";
import { generateUid } from "../../utils/uid";
import LoadingIndicator from "../LoadingIndicator";
import PaginatedTable from "./PaginatedTable";

export default function VisualizationQueries() {
    const navigate = useNavigate<LocationGenerics>();
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const queryClient = useQueryClient();
    const { isLoading, isSuccess, isError, error, data } = useNamespace<IData>(
        "i-visualization-queries",
        storage,
        systemId,
        []
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");
    const [q, setQ] = useState<string>("");
    const [loading2, setLoading2] = useState<boolean>(false);

    const last = currentPage * 20;

    const [currentData, setCurrentData] = useState<IData[] | undefined>(
        data
            ?.filter((d) => {
                return (
                    d &&
                    (d.name?.toLowerCase().includes(q.toLowerCase()) ||
                        d.id.includes(q))
                );
            })
            .slice(last - 20, last)
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
                    .slice(last - 20, last);
            }
            return [];
        });
    }, [currentPage, q, data]);

    const deleteResource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-visualization-queries", id, engine);
        setCurrentData((prev) => prev?.filter((p) => p.id !== id));
        setLoading(() => false);
    };
    return (
        <Stack>
            <Text fontSize="2xl" fontWeight="bold" p="2" color="blue.600">Visualisation Queries</Text>
            <Stack direction="row">

                <Input
                    value={q}
                    placeholder="Search Visualization Queries"
                    width="50%"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setQ(e.target.value)
                    }
                />
                <Spacer />
                <Button
                    onClick={() => {
                        const visualizationQuery = createVisualizationQuery();
                        navigate({
                            to: `/settings/visualization-queries/${visualizationQuery.id}`,
                            search: { action: "create" },
                        });
                    }}
                    colorScheme="blue"
                >
                    <AddIcon mr="2" />
                    Add Visualization Query
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
                    <Stack spacing="10px" w="100%">
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Data Source</Th>
                                    <Th>Description</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {currentData?.map(
                                    (visualizationQuery: IData) => (
                                        <Tr key={visualizationQuery.id}>
                                            <Td>
                                                <Link<LocationGenerics>
                                                    to={`/settings/visualization-queries/${visualizationQuery.id}`}
                                                    search={{
                                                        action: "update",
                                                    }}
                                                >
                                                    {visualizationQuery.name}
                                                </Link>
                                            </Td>
                                            <Td>
                                                {
                                                    visualizationQuery
                                                        ?.dataSource?.name
                                                }
                                            </Td>
                                            <Td>
                                                {
                                                    visualizationQuery?.description
                                                }
                                            </Td>
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
                                                                    visualizationQuery.id
                                                            );
                                                            const id =
                                                                generateUid();
                                                            setLoading2(
                                                                () => true
                                                            );
                                                            await saveDocument(
                                                                storage,
                                                                "i-visualization-queries",
                                                                systemId,
                                                                {
                                                                    ...visualizationQuery,
                                                                    id,
                                                                },
                                                                engine,
                                                                "create"
                                                            );
                                                            await queryClient.invalidateQueries(
                                                                [
                                                                    "visualization-queries",
                                                                ]
                                                            );
                                                            setLoading2(
                                                                () => false
                                                            );
                                                            navigate({
                                                                to: `/settings/visualization-queries/${id}`,
                                                                search: {
                                                                    action: "update",
                                                                },
                                                            });
                                                        }}
                                                        isLoading={
                                                            loading2 &&
                                                            currentId ===
                                                            visualizationQuery.id
                                                        }
                                                    >
                                                        Duplicate
                                                    </Button>
                                                    <Button
                                                        colorScheme="red"
                                                        size="xs"
                                                        isLoading={
                                                            loading &&
                                                            currentId ===
                                                            visualizationQuery.id
                                                        }
                                                        onClick={() =>
                                                            deleteResource(
                                                                visualizationQuery.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            </Td>
                                        </Tr>
                                    )
                                )}
                            </Tbody>
                        </Table>
                        <PaginatedTable
                            currentPage={currentPage}
                            setNextPage={setCurrentPage}
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
}
