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
import {
    $hasDHIS2,
    $paginations,
    $visualizationQuery,
    $totals,
} from "../../Store";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const OrganizationUnitLevels = ({ api, isCurrentDHIS2 }: MetadataAPI) => {
    const { previousType, isGlobal } = computeGlobalParams(
        "oul",
        "GQhi6pRnTKF"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    const [q, setQ] = useState<string>("");
    const total = useStore($totals);
    const visualizationQuery = useStore($visualizationQuery);
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
        q,
        isCurrentDHIS2,
        api,
        resource: "filledOrganisationUnitLevels.json",
        derive: false,
    });

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(nextPage);
    };

    return (
        <Stack spacing="30px">
            <GlobalSearchFilter
                dimension="ou"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="oul"
                prefix="LEVEL-"
                type={type}
                setQ={setQ}
                q={q}
                id={globalIds[4].value}
            />
            <Text>{type}</Text>
            {isLoading && (
                <Flex w="100%" alignItems="center" justifyContent="center">
                    <LoadingIndicator />
                </Flex>
            )}
            {isSuccess && data && !useGlobal && (
                <Stack>
                    <pre>{JSON.stringify(visualizationQuery, null, 2)}</pre>
                    <Table
                        variant="striped"
                        colorScheme="gray"
                        textTransform="none"
                    >
                        <Thead>
                            <Tr>
                                <Th w="10px">
                                    <Checkbox />
                                </Th>
                                <Th>
                                    <Heading
                                        as="h6"
                                        size="xs"
                                        textTransform="none"
                                    >
                                        Id
                                    </Heading>
                                </Th>
                                <Th>
                                    <Heading
                                        as="h6"
                                        size="xs"
                                        textTransform="none"
                                    >
                                        Name
                                    </Heading>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((record: any) => (
                                <Tr key={record.level}>
                                    <Td>
                                        {record.level}--{record.id}
                                        <Checkbox
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                if (e.target.checked) {
                                                    datumAPi.changeDimension({
                                                        id: record.level,
                                                        type,
                                                        dimension: "ou",
                                                        resource: "oul",
                                                        prefix: "LEVEL-",
                                                    });
                                                } else {
                                                    datumAPi.changeDimension({
                                                        id: record.level,
                                                        type,
                                                        dimension: "ou",
                                                        resource: "oul",
                                                        prefix: "LEVEL-",
                                                        remove: true,
                                                    });
                                                }
                                            }}
                                            isChecked={
                                                !isEmpty(
                                                    visualizationQuery
                                                        .dataDimensions?.[
                                                        record.level
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
                </Stack>
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

export default OrganizationUnitLevels;
