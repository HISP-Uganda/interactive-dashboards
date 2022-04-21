import { useState,ChangeEvent } from "react";
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
  CircularProgress,
  Heading,
  Radio,
  RadioGroup,
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
import { IndicatorProps } from "../../interfaces";
import { useOrganisationUnitLevels } from "../../Queries";
import { $store } from "../../Store";
import GlobalAndFilter from "./GlobalAndFilter";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const OrganizationUnitLevels = ({ denNum, onChange }: IndicatorProps) => {
  const [dimension, setDimension] = useState<"filter" | "dimension">("filter");
  const [useGlobal, setUseGlobal] = useState<boolean>(true);
  const store = useStore($store);
  const {
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total: store.paginations.totalOrganisationUnitLevels,
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
    useOrganisationUnitLevels(currentPage, pageSize);

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <Stack>
      <GlobalAndFilter
        dimension={dimension}
        setDimension={setDimension}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
      />
      {isLoading && (
        <CircularProgress isIndeterminate color="blue.700" thickness={3} />
      )}
      {isSuccess && !useGlobal && (
        <Table
          variant="striped"
          size="sm"
          colorScheme="gray"
          textTransform="none"
        >
          <Thead>
            <Tr py={1}>
              <Th>
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        onChange({
                          id: record.id,
                          type: dimension,
                          what: "oul",
                        });
                      } else {
                        onChange({
                          id: record.id,
                          type: dimension,
                          what: "oul",
                          remove: true,
                        });
                      }
                    }}
                    checked={!!denNum.dataDimensions?.[record.id]}
                  />
                </Td>
                <Td>{record.id}</Td>
                <Td>{record.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
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
            bg="yellow.300"
          >
            <Text>Previous</Text>
          </PaginationPrevious>
          <PaginationNext
            _hover={{
              bg: "yellow.400",
            }}
            bg="yellow.300"
          >
            <Text>Next</Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
      {isError && <Box>{error?.message}</Box>}
    </Stack>
  );
};

export default OrganizationUnitLevels;
