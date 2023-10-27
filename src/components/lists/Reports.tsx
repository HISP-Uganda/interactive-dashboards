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
import React, { useEffect, useState } from "react";
import { IReport, LocationGenerics } from "../../interfaces";
import { deleteDocument, useNamespace } from "../../Queries";
import { $settings, $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import LoadingIndicator from "../LoadingIndicator";
import TableHeader from "../TableHeader";
import { Popconfirm } from "antd";

export default function Reports() {
    const navigate = useNavigate<LocationGenerics>();
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");

    const { isLoading, isSuccess, isError, error, data } =
        useNamespace<IReport>("i-reports", storage, systemId, []);
    const [response, setResponse] = useState<IReport[] | undefined>(data);
    const deleteResource = async (id: string) => {
        setCurrentId(() => id);
        setLoading(() => true);
        await deleteDocument(storage, "i-reports", id, engine);
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
                    Reports
                </Text>
                <Spacer />
                <Button
                    colorScheme="blue"
                    onClick={() =>
                        navigate({
                            to: `/settings/reports/${generateUid()}`,
                            search: {
                                action: "create",
                            },
                        })
                    }
                    size="sm"
                >
                    <AddIcon mr="2" />
                    Add Report
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
                    <Table variant="striped" w="100%" size="sm">
                        <TableHeader>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Description</Th>
                                <Th w="200px">Actions</Th>
                            </Tr>
                        </TableHeader>
                        <Tbody>
                            {response?.map((report: IReport) => (
                                <Tr key={report.id}>
                                    <Td>
                                        <Link<LocationGenerics>
                                            to={`/settings/reports/${report.id}`}
                                            search={{ action: "update" }}
                                        >
                                            {report.name}
                                        </Link>
                                    </Td>
                                    <Td>{report.description}</Td>
                                    <Td>
                                        <Stack direction="row" spacing="5px">
                                            <Button
                                                colorScheme="green"
                                                size="xs"
                                                onClick={() =>
                                                    navigate({
                                                        to: `/settings/reports/${report.id}`,
                                                        search: (prev) => ({
                                                            ...prev,
                                                            action: "update",
                                                        }),
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                colorScheme="green"
                                                size="xs"
                                                onClick={() =>
                                                    navigate({
                                                        to: `/settings/reports/${report.id}/design`,
                                                        search: {
                                                            action: "update",
                                                        },
                                                    })
                                                }
                                            >
                                                Design
                                            </Button>
                                            <Button size="xs">Duplicate</Button>

                                            <Popconfirm
                                                title="Delete the report"
                                                description="Are you sure to delete this report?"
                                                onConfirm={() =>
                                                    deleteResource(report.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    colorScheme="red"
                                                    size="xs"
                                                    isLoading={
                                                        loading &&
                                                        currentId === report.id
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
                )}
                {isError && <Text>No data/Error occurred</Text>}
            </Stack>
        </Stack>
    );
}
