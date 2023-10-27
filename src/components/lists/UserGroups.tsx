import {
    Checkbox,
    Input,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { IUserGroup } from "../../interfaces";
import { useNamespace } from "../../Queries";
import { $settings, $store, $report } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import Scrollable from "../Scrollable";
import TableHeader from "../TableHeader";
import PaginatedTable from "./PaginatedTable";
import { reportApi } from "../../Events";
import { uniq } from "lodash";

const NUMBER_PER_PAGE = 15;
export default function UserGroups() {
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } =
        useNamespace<IUserGroup>("i-user-groups", storage, systemId, []);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [q, setQ] = useState<string>("");
    const report = useStore($report);
    const [currentData, setCurrentData] = useState<IUserGroup[] | undefined>(
        data?.filter((d) => {
            return (
                d &&
                (d.name?.toLowerCase().includes(q.toLowerCase()) ||
                    d.id.includes(q))
            );
        })
    );
    useEffect(() => {
        setCurrentData(() => {
            if (data) {
                return data.filter((d) => {
                    return (
                        d &&
                        (d.name?.toLowerCase().includes(q.toLowerCase()) ||
                            d.id.includes(q))
                    );
                });
            }
            return [];
        });
    }, [currentPage, q, data]);

    const select = (value: boolean, emails: string[]) => {
        const allValues = report.emails.split(",");

        if (value) {
            reportApi.update({
                attribute: "emails",
                value: uniq([...allValues, emails])
                    .filter((val) => !!val)
                    .join(","),
            });
        }
    };

    return (
        <Stack w="100%" h="100%">
            <Stack direction="row">
                <Input
                    value={q}
                    placeholder="Search"
                    width="25%"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setQ(e.target.value)
                    }
                    size="sm"
                />
            </Stack>
            <Stack
                justifyItems="center"
                alignContent="center"
                alignItems="center"
                flex={1}
                h="100%"
                w="100%"
            >
                {isLoading && <LoadingIndicator />}
                {isSuccess && (
                    <Stack spacing="10px" w="100%" h="100%">
                        <Scrollable>
                            <Table variant="striped" size="sm">
                                <TableHeader>
                                    <Tr>
                                        <Th w="20px"></Th>
                                        <Th>Name</Th>
                                        <Th>Emails</Th>
                                    </Tr>
                                </TableHeader>
                                <Tbody>
                                    {currentData?.map((userGroup) => (
                                        <Tr key={userGroup.id}>
                                            <Td>
                                                <Checkbox
                                                    onChange={(
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        select(
                                                            e.target.checked,
                                                            userGroup.email
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>{userGroup.name}</Td>
                                            <Td>
                                                {userGroup?.email.join(",")}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Scrollable>
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
                            pageSize={NUMBER_PER_PAGE}
                        />
                    </Stack>
                )}
                {isError && <Text>No data/Error occurred</Text>}
            </Stack>
        </Stack>
    );
}
