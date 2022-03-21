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
} from "@chakra-ui/react";
import { useNavigate } from "react-location";
import { $store } from "../Store";
import { ICategory } from "../interfaces";
import { useNamespace } from "../Queries";
import NewCategoryDialog from "./NewCategoryDialog";
import { useStore } from "effector-react";

const Categories = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-categories");
  return (
    <Stack>
      <Stack direction="row" spacing="10px">
        <NewCategoryDialog />
        {store.categories.length > 0 && (
          <Button onClick={() => navigate({ to: "../dashboards" })}>
            Dashboards
          </Button>
        )}
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
