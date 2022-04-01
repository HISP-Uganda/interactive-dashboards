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
  CircularProgress,
  Heading,
  Select,
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
import { useSQLViews } from "../../Queries";
import { $store } from "../../Store";

const OUTER_LIMIT = 4;
const INNER_LIMIT = 4;

const SQLViews = () => {
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error, data } = useSQLViews();

  return (
    <>
      {isLoading && (
        <CircularProgress isIndeterminate color="blue.700" thickness={3} />
      )}
      {isSuccess && (
        <Stack>
          <Text>SQL View</Text>
          <Select>
            {data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Stack>
      )}
      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default SQLViews;
