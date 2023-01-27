import { useState, useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
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
import { Link, useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { ICategory } from "../../interfaces";
import { deleteDocument, useCategories } from "../../Queries";
import { $category, $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import { generalPadding, otherHeight } from "../constants";

const Categories = () => {
  const navigate = useNavigate();
  const { systemId } = useStore($store);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string>("");
  const { isLoading, isSuccess, isError, error, data } =
    useCategories(systemId);
  const [response, setResponse] = useState<ICategory[] | undefined>(data);
  const deleteResource = async (id: string) => {
    setCurrentId(() => id);
    setLoading(() => true);
    await deleteDocument("i-categories", id);
    setResponse((prev) => prev?.filter((p) => p.id !== id));
    setLoading(() => false);
  };
  useEffect(() => {
    setResponse(() => data);
  }, [data]);

  return (
    <Stack
      flex={1}
      p={`${generalPadding}px`}
      bgColor="white"
      w="100%"
      h={otherHeight}
      maxH={otherHeight}
      overflow="auto"
    >
      <Stack direction="row">
        <Spacer />
        <Button
          colorScheme="blue"
          onClick={() => navigate({ to: `/categories/${generateUid()}` })}
        >
          <AddIcon mr="2" />
          Add Category
        </Button>
      </Stack>
      <Divider borderColor="blue.500" />
      <Stack
        justifyItems="center"
        alignContent="center"
        alignItems="center"
        flex={1}
      >
        {isLoading && <Spinner />}
        {isSuccess && (
          <Table variant="simple" w="100%">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {response?.map((category: ICategory) => (
                <Tr key={category.id}>
                  <Td>
                    <Link to={`/categories/${category.id}`}>
                      {category.name}
                    </Link>
                  </Td>
                  <Td>{category.description}</Td>
                  <Td>
                    <Stack direction="row" spacing="5px">
                      <Button colorScheme="green" size="xs">
                        Edit
                      </Button>
                      <Button size="xs">Duplicate</Button>
                      <Button
                        colorScheme="red"
                        size="xs"
                        isLoading={loading && currentId === category.id}
                        onClick={() => deleteResource(category.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </Stack>
    </Stack>
  );
};

export default Categories;
