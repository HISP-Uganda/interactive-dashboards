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
  Input,
  Spinner,
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
import { ChangeEvent, useState } from "react";
import { IndicatorProps } from "../../interfaces";
import { useOrganisationUnitGroups } from "../../Queries";
import { $paginations } from "../../Store";
import { globalIds } from "../../utils/utils";
import GlobalAndFilter from "./GlobalAndFilter";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const OrganizationUnitGroups = ({ denNum, onChange }: IndicatorProps) => {
  const paginations = useStore($paginations);
  const [type, setType] = useState<"filter" | "dimension">("dimension");
  const [q, setQ] = useState<string>("");
  const selected = Object.entries(denNum?.dataDimensions || {})
    .filter(([k, { resource }]) => resource === "oug")
    .map(([key]) => {
      return key;
    });
  const [useGlobal, setUseGlobal] = useState<boolean>(
    () => selected.indexOf("of2WvtwqbHR") !== -1
  );

  const {
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total: paginations.totalOrganisationUnitGroups,
    limits: {
      outer: OUTER_LIMIT,
      inner: INNER_LIMIT,
    },
    initialState: {
      pageSize: 10,
      currentPage: 1,
    },
  });
  const { isLoading, isSuccess, isError, error, data } =
    useOrganisationUnitGroups(currentPage, pageSize, q);
  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };
  return (
    <Stack spacing="30px">
      <GlobalSearchFilter
        denNum={denNum}
        dimension="ou"
        setType={setType}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        resource="oug"
        type={type}
        onChange={onChange}
        setQ={setQ}
        prefix="OU_GROUP-"
        q={q}
        id={globalIds[3].value}
      />
      {isLoading && (
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {isSuccess && data && !useGlobal && (
        <Table variant="striped" colorScheme="gray" textTransform="none">
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
          <Tbody>
            {data.map((record: any) => (
              <Tr key={record.id}>
                <Td>
                  <Checkbox
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        onChange({
                          id: record.id,
                          type,
                          dimension: "ou",
                          resource: "oug",
                          prefix: "OU_GROUP-",
                        });
                      } else {
                        onChange({
                          id: record.id,
                          type,
                          dimension: "ou",
                          resource: "oug",
                          prefix: "OU_GROUP-",
                          remove: true,
                        });
                      }
                    }}
                    checked={!!denNum?.dataDimensions?.[record.id]}
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

export default OrganizationUnitGroups;
