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
import { useNavigate } from "@tanstack/react-location";
import { Popconfirm } from "antd";
import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import { dashboardApi, dashboardTypeApi, storeApi } from "../../Events";
import { IDashboard, LocationGenerics } from "../../interfaces";
import { deleteDocument, useDashboards, saveDocument } from "../../Queries";
import { $path, $settings, $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import LoadingIndicator from "../LoadingIndicator";
import { useQueryClient } from "@tanstack/react-query";
import Scrollable from "../Scrollable";
import TableHeader from "../TableHeader";
import { useElementSize } from "usehooks-ts";

const Dashboards = () => {
    const [squareRef, { height, width }] = useElementSize();

    const navigate = useNavigate<LocationGenerics>();
    const store = useStore($store);
    const { storage, template } = useStore($settings);
    const queryClient = useQueryClient();
    const path = useStore($path);
    const engine = useDataEngine();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");
    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );

    const [response, setResponse] = useState<IDashboard[] | undefined>(data);

    const deleteResource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-dashboards", id, engine);
        setResponse((prev) => prev?.filter((p) => p.id !== id));
        setLoading(() => false);
    };

    useEffect(() => {
        setResponse(() => data);
    }, [data]);

    const duplicate = async (dashboard: IDashboard) => {
        const id = generateUid();
        await saveDocument(
            storage,
            "i-dashboards",
            store.systemId,
            {
                ...dashboard,
                id,
            },
            engine,
            "create"
        );
        await queryClient.invalidateQueries(["i-dashboards"]);
        navigate({
            to: `/dashboards/${id}`,
            search: {
                action: "update",
                category: dashboard.category,
                periods: store.periods.map((i) => i.value),
                organisations: store.organisations,
                groups: store.groups,
                levels: store.levels,
                display: "dashboard",
            },
        });
    };

    return (
        <Stack p="20px" h="100%" w="100%">
            <Text fontSize="2xl" fontWeight="bold" p="2" color="blue.600">
                Dashboard List
            </Text>
            <Stack direction="row">
                <Spacer />
                <Button
                    onClick={() => {
                        dashboardTypeApi.set("dynamic");
                        storeApi.setRefresh(true);
                        navigate({
                            to: `/dashboards/${generateUid()}`,
                            search: {
                                action: "create",
                                periods: store.periods.map((i) => String(i.id)),
                                organisations: store.organisations,
                                groups: store.groups,
                                levels: store.levels,
                            },
                        });
                    }}
                    colorScheme="blue"
                    size="sm"
                >
                    <AddIcon mr="2" />
                    New Dynamic Dashboard
                </Button>
                <Button
                    onClick={() => {
                        dashboardTypeApi.set("fixed");
                        storeApi.setRefresh(true);
                        navigate({
                            to: `/dashboards/${generateUid()}`,
                            search: {
                                action: "create",
                                periods: store.periods.map((i) => i.value),
                                organisations: store.organisations,
                                groups: store.groups,
                                levels: store.levels,
                            },
                        });
                    }}
                    colorScheme="blue"
                    size="sm"
                >
                    <AddIcon mr="2" />
                    New Fixed Dashboard
                </Button>
            </Stack>
            <Stack
                alignContent="center"
                alignItems="center"
                w="100%"
                h="100%"
                ref={squareRef}
            >
                {isLoading && <LoadingIndicator />}
                {isSuccess && (
                    <Scrollable whiteSpace="normal" height={`${height}px`}>
                        <Table variant="striped" w="100%" size="sm">
                            <TableHeader>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Category</Th>
                                    <Th>Published</Th>
                                    <Th>Refresh Interval</Th>
                                    <Th>Description</Th>
                                    <Th w="200px" bg="red.400">
                                        Actions
                                    </Th>
                                </Tr>
                            </TableHeader>
                            <Tbody>
                                {response?.map((dashboard: IDashboard) => (
                                    <Tr key={dashboard.id} cursor="pointer">
                                        <Td
                                            onClick={async () => {
                                                dashboardApi.setCurrentDashboard(
                                                    dashboard
                                                );
                                                storeApi.changeSelectedDashboard(
                                                    dashboard.id
                                                );
                                                storeApi.changeSelectedCategory(
                                                    dashboard.category || ""
                                                );
                                                let currentPath = path;
                                                if (dashboard.id === template) {
                                                    currentPath =
                                                        "/dashboards/";
                                                }
                                                navigate({
                                                    to: `${currentPath}${dashboard.id}`,
                                                    search: {
                                                        action: "update",
                                                        category:
                                                            dashboard.category,
                                                        periods:
                                                            store.periods.map(
                                                                (i) => i.value
                                                            ),
                                                        organisations:
                                                            store.organisations,
                                                        groups: store.groups,
                                                        levels: store.levels,
                                                        display: "dashboard",
                                                    },
                                                });
                                            }}
                                        >
                                            {dashboard.name}
                                        </Td>
                                        <Td>{dashboard.category}</Td>
                                        <Td>
                                            {dashboard.published ? "Yes" : "No"}
                                        </Td>
                                        <Td>{dashboard.refreshInterval}</Td>
                                        <Td>{dashboard.description}</Td>
                                        <Td>
                                            <Stack
                                                direction="row"
                                                spacing="5px"
                                            >
                                                <Button
                                                    colorScheme="green"
                                                    size="xs"
                                                    onClick={async () => {
                                                        dashboardApi.setCurrentDashboard(
                                                            dashboard
                                                        );
                                                        storeApi.changeSelectedDashboard(
                                                            dashboard.id
                                                        );
                                                        storeApi.changeSelectedCategory(
                                                            dashboard.category ||
                                                                ""
                                                        );

                                                        navigate({
                                                            to: `/dashboards/${dashboard.id}`,
                                                            search: {
                                                                action: "update",
                                                                category:
                                                                    dashboard.category,
                                                                periods:
                                                                    store.periods.map(
                                                                        (i) =>
                                                                            i.value
                                                                    ),
                                                                organisations:
                                                                    store.organisations,
                                                                groups: store.groups,
                                                                levels: store.levels,
                                                                display:
                                                                    "dashboard",
                                                            },
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    onClick={() =>
                                                        duplicate(dashboard)
                                                    }
                                                >
                                                    Duplicate
                                                </Button>
                                                <Popconfirm
                                                    title="Delete the dashboard"
                                                    description="Are you sure to delete this dashboard?"
                                                    onConfirm={() =>
                                                        deleteResource(
                                                            dashboard.id
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
                                                                dashboard.id
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

export default Dashboards;
