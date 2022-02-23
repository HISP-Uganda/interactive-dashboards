import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
const Categories = () => {
  const store = useStore($store);
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Id</Th>
        </Tr>
      </Thead>
      <Tbody>
        {store.categories.map((category: string) => (
          <Tr key={category}>
            <Td>{category}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Categories;
