import { Button, Divider, Stack, StackProps } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $categoryOptions, $store } from "../Store";
import Menus from "./Menus";
import NavItem from "./NavItem";
interface SidebarProps extends StackProps {}

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const categoryOptions = useStore($categoryOptions);
  const store = useStore($store);
  return (
    <Stack w={{ base: "full", md: "250px" }} {...rest}>
      <Button
        fontSize="xl"
        fontWeight="bold"
        textTransform="uppercase"
        color="blue.600"
      >
        Thematic Areas
      </Button>
      <Divider />

      {store.isAdmin ? (
        store.currentPage === "dashboards" ? (
          categoryOptions.map((link) => (
            <NavItem key={link.value} option={link} />
          ))
        ) : store.currentPage === "sections" ? null : (
          <Menus />
        )
      ) : (
        categoryOptions.map((link) => (
          <NavItem key={link.value} option={link} />
        ))
      )}
    </Stack>
  );
};

export default SidebarContent;
