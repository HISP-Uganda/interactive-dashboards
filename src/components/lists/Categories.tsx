import { useEffect } from "react";
import {
  Button,
  Divider,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { setCategory, setShowSider } from "../../Events";
import { ICategory } from "../../interfaces";
import { useCategories } from "../../Queries";
import { $categories } from "../../Store";
import { generateUid } from "../../utils/uid";
import { AddIcon } from "@chakra-ui/icons";

const Categories = () => {
  const navigate = useNavigate();
  const categories = useStore($categories);
  const { isLoading, isSuccess, isError, error } = useCategories();
  useEffect(() => {
    setShowSider(true);
  }, []);
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Spacer />
        <Button
        colorScheme="blue"
          onClick={() => navigate({ to: `/categories/${generateUid()}` })}
        >
          <AddIcon mr="2"/>
          Add Category
        </Button>
      </Stack>
      <Divider borderColor="blue.500" />
      {isLoading && <Spinner />}
      {isSuccess && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category: ICategory) => (
              <Tr
                key={category.id}
                cursor="pointer"
                onClick={() => {
                  setCategory(category);
                  navigate({
                    to: `/categories/${category.id}`,
                    search: { edit: true },
                  });
                }}
              >
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
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
