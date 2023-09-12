import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Checkbox,
    Flex,
    Heading,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { isEmpty } from "lodash";
import { ChangeEvent, useState } from "react";
import { datumAPi } from "../../Events";
import { MetadataAPI } from "../../interfaces";
import { useDHIS2Resources } from "../../Queries";
import { $totals, $visualizationQuery } from "../../Store";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const OrganizationUnitGroupSets = ({ api, isCurrentDHIS2 }: MetadataAPI) => {
    const total = useStore($totals);
    const visualizationQuery = useStore($visualizationQuery);
    const [q, setQ] = useState<string>("");

    const { previousType, isGlobal } = computeGlobalParams(
        "ougs",
        "GQhi6pRnTKF"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    const {
        pages,
        pagesCount,
        currentPage,
        setCurrentPage,
        isDisabled,
        pageSize,
        setPageSize,
    } = usePagination({
        total,
        limits: {
            outer: OUTER_LIMIT,
            inner: INNER_LIMIT,
        },
        initialState: {
            pageSize: 10,
            currentPage: 1,
        },
    });
    const { isLoading, isSuccess, isError, error, data } = useDHIS2Resources({
        page: currentPage,
        pageSize,
        isCurrentDHIS2,
        q,
        api,
        resource: "organisationUnitGroupSets.json",
    });
    const handlePageChange = (nextPage: number) => {
        setCurrentPage(nextPage);
    };
    return (
        <Stack spacing="30px">
            <GlobalSearchFilter
                dimension=""
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="ougs"
                type={type}
                setQ={setQ}
                q={q}
                id={globalIds[3].value}
            />
            {isLoading && (
                <Flex w="100%" alignItems="center" justifyContent="center">
                    <LoadingIndicator />
                </Flex>
            )}
            {isSuccess && data && !useGlobal && (
                <Table
                    variant="striped"
                    colorScheme="gray"
                    textTransform="none"
                >
                    <Thead>
                        <Tr py={1}>
                            <Th w="10px">
                                <Checkbox />
                            </Th>
                            <Th>
                                <Heading as="h6" size="xs" textTransform="none">
                                    Id
                                </Heading>
                            </Th>
                            <Th>
                                <Heading as="h6" size="xs" textTransform="none">
                                    Name
                                </Heading>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody py={10}>
                        {data.map((record: any) => (
                            <Tr key={record.id}>
                                <Td>
                                    <Checkbox
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            if (e.target.checked) {
                                                datumAPi.changeDimension({
                                                    id: record.id,
                                                    type,
                                                    dimension: "",
                                                    resource: "ougs",
                                                });
                                            } else {
                                                datumAPi.changeDimension({
                                                    id: record.id,
                                                    type,
                                                    dimension: "",
                                                    resource: "ougs",
                                                    remove: true,
                                                });
                                            }
                                        }}
                                        isChecked={
                                            !isEmpty(
                                                visualizationQuery
                                                    ?.dataDimensions?.[
                                                    record.id
                                                ]
                                            )
                                        }
                                    />
                                </Td>
                                <Td>{record.id}</Td>
                                <Td>{record.name}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
            {!useGlobal && (
                <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    isDisabled={isDisabled}
                    onPageChange={handlePageChange}
                >
                    <PaginationContainer
                        align="center"
                        justify="space-between"
                        p={4}
                        w="full"
                    >
                        <PaginationPrevious
                            _hover={{
                                bg: "yellow.400",
                            }}
                            bgColor="yellow.300"
                        >
                            <Text>Previous</Text>
                        </PaginationPrevious>
                        <PaginationNext
                            _hover={{
                                bg: "yellow.400",
                            }}
                            bgColor="yellow.300"
                        >
                            <Text>Next</Text>
                        </PaginationNext>
                    </PaginationContainer>
                </Pagination>
            )}
            {isError && <Box>{error?.message}</Box>}
        </Stack>
    );
};

export default OrganizationUnitGroupSets;
