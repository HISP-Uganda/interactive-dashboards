import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { $dashboard, $dashboardCategory } from "../../Store";
import CategorySelect from "../CategorySelect";

const DashboardFilter = () => {
  const dashboard = useStore($dashboard);
  const dashboardCategory = useStore($dashboardCategory);
  return (
    <Stack spacing="1px" direction="row" fontSize="16px">
      <Text>{dashboardCategory}</Text>
      <Text>/</Text>
      <Text>{dashboard.name}</Text>
    </Stack>
  );
};

export default DashboardFilter;
