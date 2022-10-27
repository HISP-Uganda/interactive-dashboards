import { Divider, Stack, StackProps, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { groupBy } from "lodash";
import { $categoryOptions, $dashboards, $store } from "../Store";
import Menus from "./Menus";
import NavItem from "./NavItem";
interface SidebarProps extends StackProps {}

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const store = useStore($store);
  const dashboards = groupBy(useStore($dashboards), "category");
  const categoryOptions = useStore($categoryOptions)
    .map((category) => {
      return { ...category, dashboards: dashboards[category.value] || [] };
    })
    .filter(({ dashboards }) => dashboards.length > 0);

  return (
    <Stack {...rest} bg="blue.50" h="100%">
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
