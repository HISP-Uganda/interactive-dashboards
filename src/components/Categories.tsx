import {
  Button,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spacer
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { $store } from "../Store";
import { ICategory } from "../interfaces";
import { useNamespace } from "../Queries";
import NewCategoryDialog from "./dialogs/NewCategoryDialog";
import { useStore } from "effector-react";

const Categories = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-categories");
  return (
    <Stack flex={1} p="10px">
      <Stack direction="row">
        <Spacer />{" "}
        <Button onClick={() => navigate({ to: "/categories/form" })}>
          Add Category
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((category: ICategory) => (
              <Tr key={category.id}>
                <Td>{category.id}</Td>
                <Td>{category.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default Categories;
