import { groupBy } from "lodash";
import { useState } from "react";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { $category, $dashboard, $dashboards, $store } from "../Store";

import { FormGenerics, IDashboard, Option } from "../interfaces";
import { changeSelectedCategory } from "../Events";

interface NavItemProps {
  // icon: IconType;
  option: Option & { dashboards: IDashboard[] };
}
const NavItem = ({ option: { label, value, dashboards } }: NavItemProps) => {
  const navigate = useNavigate();
  const search = useSearch<FormGenerics>();
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const [active, setActive] = useState<string>(store.selectedCategory);
  const toggle = (id: string) => {
    if (active === id) {
      setActive("");
    } else {
      setActive(id);
    }
  };
  return (
    <Box
      // color={store.selectedCategory === value ? "blue.600" : "none"}
      // cursor="pointer"

      key={value}
      // onClick={() => {
      //   toggle(value);
      //   changeSelectedCategory(value);

      //   if (categoryDashboards.length > 0) {
      //     navigate({
      //       to: `/dashboards/${categoryDashboards[0].id}`,
      //       search,
      //     });
      //   }
      // }}
    >
      <Text
        color="gray.400"
        m="3"
        mt="4"
        fontSize="xl"
        textTransform="uppercase"
      >
        {label}
      </Text>

      {dashboards.map((d) => (
        <Flex
          alignItems="center"
          key={d.id}
          gap="5"
          pt="3"
          pl="4"
          pb="2.5"
          borderRadius="lg"
          fontSize="xl"
          m="2"
          cursor="pointer"
          _hover={{ bg: "blue.50" }}
          // color="white"
          // maxW="sm"
          // borderWidth="1px"
          // borderRadius="lg"
          // overflow="hidden"
          // key={d.id}
          // p="5px"
          // bg={dashboard.id === d.id ? "blue.50" : ""}
          color={dashboard.id === d.id ? "blue.500" : ""}
          // border={dashboard.id === d.id ? "2px" : ""}
          onClick={(e) => {
            e.stopPropagation();
            navigate({
              to: `/dashboards/${d.id}`,
              search,
            });
          }}
        >
          {d.name}
        </Flex>
      ))}
    </Box>
  );
};

export default NavItem;
