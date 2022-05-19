import {
  Button,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { ICategory } from "../../interfaces";
import { useCategories } from "../../Queries";
import { $categories } from "../../Store";

<Table variant="simple">
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>Description</Th>
    </Tr>
  </Thead>
  <Tbody></Tbody>
</Table>;

const DashboardCategories = () => {
  const navigate = useNavigate();
  const categories = useStore($categories);
  const { isLoading, isSuccess, isError, error } = useCategories();
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Spacer />
        <Button onClick={() => navigate({ to: "/categories/form" })}>
          Add Category
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Accordion>
          {categories.map((category: ICategory) => (
            // <Tr
            //   key={category.id}
            //   cursor="pointer"
            //   onClick={() => {
            //     setCategory(category);
            //     navigate({ to: "/categories/form", search: { edit: true } });
            //   }}
            // >
            //   <Td>{category.name}</Td>
            //   <Td>{category.description}</Td>
            // </Tr>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {category.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default DashboardCategories;
