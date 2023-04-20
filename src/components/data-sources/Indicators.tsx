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
import { IndicatorProps } from "../../interfaces";
import { useIndicators } from "../../Queries";
import { $currentDataSource, $hasDHIS2, $paginations } from "../../Store";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const Indicators = ({ denNum, onChange }: IndicatorProps) => {
    const { previousType, isGlobal } = computeGlobalParams(
        denNum,
        "i",
        "JRDOr08JWSW"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    const [q, setQ] = useState<string>("");
    const paginations = useStore($paginations);
    const hasDHIS2 = useStore($hasDHIS2);
    const currentDataSource = useStore($currentDataSource);
    const {
        pages,
        pagesCount,
        currentPage,
        setCurrentPage,
        isDisabled,
        pageSize,
        setPageSize,
    } = usePagination({
        total: paginations.totalIndicators,
        limits: {
            outer: OUTER_LIMIT,
            inner: INNER_LIMIT,
        },
        initialState: {
            pageSize: 10,
            currentPage: 1,
        },
    });

    const selectedIndicators = Object.entries(
        denNum?.dataDimensions || {}
    ).flatMap(([i, { resource }]) => {
        if (resource === "i") {
            return i;
        }
        return [];
    });

    const { isLoading, isSuccess, isError, error, data } = useIndicators(
        currentPage,
        pageSize,
        q,
        selectedIndicators,
        hasDHIS2,
        currentDataSource
    );

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(nextPage);
    };

    return (
        <Stack spacing="30px">
            <GlobalSearchFilter
                denNum={denNum}
                dimension="dx"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="i"
                type={type}
                onChange={onChange}
                setQ={setQ}
                q={q}
                id={globalIds[2].value}
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
                                                onChange({
                                                    id: record.id,
                                                    type,
                                                    dimension: "dx",
                                                    resource: "i",
                                                });
                                            } else {
                                                onChange({
                                                    id: record.id,
                                                    type,
                                                    dimension: "dx",
                                                    resource: "i",
                                                    remove: true,
                                                });
                                            }
                                        }}
                                        isChecked={
                                            !isEmpty(
                                                denNum?.dataDimensions?.[
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

export default Indicators;
