import { Divider, Stack, StackProps, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
// import DashboardList from "./DashboardList";
import Menus from "./Menus";
interface SidebarProps extends StackProps { }

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const store = useStore($store);

  return (
    <Stack {...rest} h="100%">
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="left"
        pl="3"
        pt="2"
        color="black"
      >
        Dashboard Menu
            </Text>
      <Divider borderColor="gray.600" />
      {store.isAdmin ? (
        store.currentPage === "dashboard" ? (
          <Text>Coming soon</Text>
        ) : // <DashboardList />
          store.currentPage === "sections" ? null : (
            <Menus />
          )
      ) : (
          <Text>Coming soon</Text>
          // <DashboardList />
        )}
    </Stack>
  );
};

export default SidebarContent;
