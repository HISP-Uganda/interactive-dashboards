import { Button, Divider, Stack, StackProps, Text } from "@chakra-ui/react";
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
    <Stack w="full" {...rest} bg="white" h="100%">
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textTransform="uppercase"
        textAlign="center"
        p="2"
      >
        Thematic Areas
      </Text>
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
