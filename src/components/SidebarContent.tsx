import { Divider, Stack, StackProps, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
import DashboardList from "./DashboardList";
import Menus from "./Menus";
interface SidebarProps extends StackProps { }

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const store = useStore($store);

  return (
    <Stack {...rest} bgColor="gray.50" h="100%">
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="left"
        textTransform="uppercase"
        pl="3"
        pt="5"
        color="blue.600"
      >
        Dashboard Menu
      </Text>
      <Divider borderColor="blue.600" />
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
