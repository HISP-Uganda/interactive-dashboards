import { ChangeEvent } from "react";
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
import { IndicatorProps } from "../../interfaces";
import { useSQLViews } from "../../Queries";
import { $store } from "../../Store";

const SQLViews = ({ denNum, onChange }: IndicatorProps) => {
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
          <Select
            value={
              data.find(
                (d: any) =>
                  Object.keys(denNum.dataDimensions).indexOf(d.id) !== -1
              )?.id
            }
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange({
                id: e.target.value,
                type: "dimension",
                what: "v",
              })
            }
          >
            <option></option>
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
