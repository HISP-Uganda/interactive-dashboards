import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useEffect } from "react";

import {
  changeSelectedCategory,
  changeSelectedDashboard,
  setCurrentDashboard,
  setDashboards,
  setShowSider,
} from "../../Events";
import { IDashboard } from "../../interfaces";
import { $dashboards, $store, createDashboard } from "../../Store";

const Dashboards = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const dashboards = useStore($dashboards);
  useEffect(() => {
    setShowSider(true);
  }, []);

  return (
    <Stack p="20px" bg="white" flex={1}>
      <Stack direction="row">
        <Spacer />
        <Button
          onClick={() => {
            const dashboard = createDashboard();
            setCurrentDashboard(dashboard);
            changeSelectedDashboard(dashboard.id);
            changeSelectedCategory(dashboard.category || "");
            setDashboards([...dashboards, dashboard]);
            navigate({
              to: `/dashboards/${dashboard.id}`,
              search: {
                category: dashboard.category,
                periods: store.periods.map((i) => i.id),
                organisations: store.organisations,
                groups: store.groups,
                levels: store.levels,
              },
            });
          }}
          colorScheme="blue"
        >
          <AddIcon mr="2" />
          Add Dashboard
        </Button>
      </Stack>
      <Divider borderColor="blue.500" />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Published</Th>
            <Th>Refresh Interval</Th>
            <Th>Description</Th>
            {/* <Th>Actions</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {dashboards.map((dashboard: IDashboard) => (
            <Tr
              key={dashboard.id}
              cursor="pointer"
              onClick={() => {
                setCurrentDashboard(dashboard);
                changeSelectedDashboard(dashboard.id);
                changeSelectedCategory(dashboard.category || "");
                navigate({
                  to: `/dashboards/${dashboard.id}`,
                  search: {
                    edit: true,
                    category: dashboard.category,
                    periods: store.periods.map((i) => i.id),
                    organisations: store.organisations,
                    groups: store.groups,
                    levels: store.levels,
                  },
                });
              }}
            >
              <Td>{dashboard.name}</Td>
              <Td>{dashboard.category}</Td>
              <Td>{dashboard.published ? "Yes" : "No"}</Td>
              <Td>{dashboard.refreshInterval}</Td>
              <Td>{dashboard.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
};

export default Dashboards;
