import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Spacer,
  Spinner,
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

import {
  changeSelectedCategory,
  changeSelectedDashboard,
  setCurrentDashboard,
  setDashboards,
  setRefresh,
} from "../../Events";
import { IDashboard } from "../../interfaces";
import { useDashboards } from "../../Queries";
import { $dashboards, $store, createDashboard } from "../../Store";
import { generateUid } from "../../utils/uid";
import { generalPadding, otherHeight } from "../constants";

const Dashboards = () => {
  const navigate = useNavigate();
  const store = useStore($store);

  // const dashboards = useStore($dashboards);
  const { isLoading, isSuccess, isError, error, data } = useDashboards(
    store.systemId
  );

  return (
    <Stack
      p={`${generalPadding}px`}
      bgColor="white"
      flex={1}
      h={otherHeight}
      maxH={otherHeight}
    >
      <Stack direction="row">
        <Spacer />
        <Button
          onClick={() => {
            setRefresh(true);
            navigate({
              to: `/dashboards/${generateUid()}`,
              search: {
                periods: store.periods.map((i) => i.id).join("-"),
                organisations: store.organisations.join("-"),
                groups: store.groups.join("-"),
                levels: store.levels.join("-"),
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
      <Stack alignContent="center" alignItems="center" flex={1}>
        {isLoading && <Spinner />}
        {isSuccess && (
          <Table variant="simple" w="100%">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Published</Th>
                <Th>Refresh Interval</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((dashboard: IDashboard) => (
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
                        periods: store.periods.map((i) => i.id).join("-"),
                        organisations: store.organisations.join("-"),
                        groups: store.groups.join("-"),
                        levels: store.levels.join("-"),
                      },
                    });
                  }}
                >
                  <Td>{dashboard.name}</Td>
                  <Td>{dashboard.category}</Td>
                  <Td>{dashboard.published ? "Yes" : "No"}</Td>
                  <Td>{dashboard.refreshInterval}</Td>
                  <Td>{dashboard.description}</Td>
                  <Td>
                    <Stack direction="row" spacing="5px">
                      <Button colorScheme="green" size="xs">
                        View
                      </Button>
                      <Button size="xs">Duplicate</Button>
                      <Button colorScheme="red" size="xs">
                        Delete
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </Stack>
    </Stack>
  );
};

export default Dashboards;
