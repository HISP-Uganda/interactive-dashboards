import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";
import {
  Box,
  Checkbox,
  CircularProgress,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  RadioGroup,
  Radio,
  Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { IData, IndicatorProps } from "../../interfaces";
import { useIndicators } from "../../Queries";
import { $store } from "../../Store";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;



const Indicators = ({ denNum, onChange }: IndicatorProps) => {
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
    total: store.paginations.totalIndicators,
    limits: {
      outer: OUTER_LIMIT,
      inner: INNER_LIMIT,
    },
    initialState: {
      pageSize: 10,
      currentPage: 1,
    },
  });
  const { isLoading, isSuccess, isError, error, data } = useIndicators(
    currentPage,
    pageSize
  );

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <Box>
      {isLoading && (
        <CircularProgress isIndeterminate color="blue.700" thickness={3} />
      )}
      {isSuccess && (
        <Table
          variant="striped"
          size="sm"
          colorScheme="gray"
          textTransform="none"
        >
          <Thead>
            <Tr py={1}>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Id
                </Heading>
              </Th>
              <Th><Heading as="h6" size="xs" textTransform="none">Name</Heading></Th>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Use as
                </Heading>
              </Th>
            </Tr>
          </Thead>
          <Tbody py={10}>
            {data.map((record: any) => (
              <Tr key={record.id}>
                <Td>{record.id}</Td>
                <Td>{record.name}</Td>
                <Td>
                  <RadioGroup
                    onChange={(type: string) =>
                      onChange({ id: record.id, type, what: "i" })
                    }
                    value={denNum.dataDimensions?.[record.id]?.type}
                  >
                    <Stack direction="row">
                      <Radio value="dimension">Dimension</Radio>
                      <Radio value="filter">Filter</Radio>
                    </Stack>
                  </RadioGroup>
                </Td>
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
          {/* <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator
                onClick={() => console.warn("I'm clicking the separator")}
                bg="blue.300"
                fontSize="sm"
                w={14}
                jumpSize={11}
              />
            }
          >
            {pages.map((page: number) => (
              <PaginationPage
                w={14}
                bg="red.300"
                key={`pagination_page_${page}`}
                page={page}
                fontSize="sm"
                _hover={{
                  bg: "green.300",
                }}
                _current={{
                  bg: "green.300",
                  fontSize: "sm",
                  w: 14,
                }}
              />
            ))}
          </PaginationPageGroup> */}
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
    </Box>
  );
};

export default Indicators;
