import { Divider, Stack, StackProps, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
import DashboardList from "./DashboardList";
import Menus from "./Menus";
interface SidebarProps extends StackProps {}

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const store = useStore($store);

  return (
    <Stack {...rest} bgColor="blue.50" h="100%">
      <Text
        fontSize="xl"
        fontWeight="bold"
        textTransform="uppercase"
        textAlign="left"
        // p="2"
        color="blue.600"
      >
        Thematic Areas
      </Text>
      <Divider borderColor="blue.500" />
      {store.isAdmin ? (
        store.currentPage === "dashboard" ? (
          <DashboardList />
        ) : store.currentPage === "sections" ? null : (
          <Menus />
        )
      ) : (
        <DashboardList />
      )}
    </Stack>
  );
};

export default SidebarContent;
