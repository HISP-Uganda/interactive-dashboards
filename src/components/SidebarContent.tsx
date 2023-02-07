import { Divider, Stack, StackProps, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
import DashboardList from "./DashboardList";
import Menus from "./Menus";
interface SidebarProps extends StackProps {}

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const store = useStore($store);

  return (
    <Stack {...rest} bgColor="gray.50" h="100%" >
      <Text
        fontSize="xl"
        fontWeight="bold"
        textTransform="uppercase"
        textAlign="left"
        pl="3"
        pt="2"
        color="yellow.500"
      >
        Dashboard Menu
      </Text>
      <Divider borderColor="gray.600" />
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
