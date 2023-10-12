import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    IconButton,
    Input,
    Stack,
    Table,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import React, { ChangeEvent, useState } from "react";
import { dashboardApi } from "../Events";
import { $dashboard } from "../Store";
import { generateUid } from "../utils/uid";
import DashboardDropDown from "./DashboardDropDown";

export default function DashboardFilter() {
    const dashboard = useStore($dashboard);
    const [active, setActive] = useState<string>("");
    return (
        <Table
            size="sm"
            w="100%"
            bg="white"
            style={{ borderSpacing: 0, borderCollapse: "collapse" }}
        >
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Resource</Th>
                    <Th>Search Key</Th>
                    <Th w="200px">Parent</Th>
                    <Th>Dashboard</Th>
                    <Th w="70px">Action</Th>
                </Tr>
            </Thead>
            <Tbody>
                {dashboard.filters?.map((filter) =>
                    filter.id === active ? (
                        <Tr key={filter.id}>
                            <Td>{filter.id}</Td>
                            <Td>
                                <Input
                                    size="sm"
                                    value={filter.resource}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dashboardApi.processFilters({
                                            key: "resource",
                                            value: e.target.value,
                                            id: filter.id,
                                        })
                                    }
                                />
                            </Td>
                            <Td>
                                <Input
                                    size="sm"
                                    value={filter.resourceKey}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dashboardApi.processFilters({
                                            key: "resourceKey",
                                            value: e.target.value,
                                            id: filter.id,
                                        })
                                    }
                                />
                            </Td>

                            <Td>
                                <Input
                                    size="sm"
                                    value={filter.parent}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dashboardApi.processFilters({
                                            key: "parent",
                                            value: e.target.value,
                                            id: filter.id,
                                        })
                                    }
                                />
                            </Td>
                            <Td>
                                <DashboardDropDown
                                    value={filter.dashboard || ""}
                                    onChange={(value) =>
                                        dashboardApi.processFilters({
                                            key: "dashboard",
                                            value,
                                            id: filter.id,
                                        })
                                    }
                                />
                            </Td>
                            <Td>
                                <Stack direction="row">
                                    <Button
                                        size="xs"
                                        onClick={() => setActive(() => "")}
                                    >
                                        OK
                                    </Button>
                                </Stack>
                            </Td>
                        </Tr>
                    ) : (
                        <Tr key={filter.id}>
                            <Td>{filter.id}</Td>
                            <Td>{filter.resource}</Td>
                            <Td>{filter.resourceKey}</Td>
                            <Td>{filter.parent}</Td>
                            <Td>{filter.dashboard}</Td>
                            <Td>
                                <Stack direction="row">
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        onClick={() =>
                                            setActive(() => filter.id)
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="xs"
                                        colorScheme="red"
                                        onClick={() =>
                                            dashboardApi.removeFilter(filter)
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
            <Tfoot>
                <Tr>
                    <Td colSpan={6} textAlign="right">
                        <IconButton
                            bgColor="none"
                            aria-label="add"
                            size="xs"
                            icon={<AddIcon w={2} h={2} />}
                            onClick={() => {
                                const id = generateUid();
                                dashboardApi.addFilter({
                                    id,
                                    resource: "",
                                    resourceKey: "",
                                });
                                setActive(() => id);
                            }}
                        />
                    </Td>
                </Tr>
            </Tfoot>
        </Table>
    );
}
