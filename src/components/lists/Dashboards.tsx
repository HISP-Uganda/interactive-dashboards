import { useEffect } from 'react';
import {
  Button,
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
import { setCurrentDashboard, setShowSider } from "../../Events";
import { IDashboard } from "../../interfaces";
import { useDashboards } from "../../Queries";
import { $dashboards } from "../../Store";

const Dashboards = () => {
  const navigate = useNavigate();
  const dashboards = useStore($dashboards);
  const { isLoading, isSuccess, isError, error } = useDashboards();
  useEffect(() => {
    setShowSider(true);
  }, []);
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Spacer />{" "}
        <Button onClick={() => navigate({ to: "/dashboards/form" })}>
          Add Dashboard
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dashboards.map((dashboard: IDashboard) => (
              <Tr
                key={dashboard.id}
                cursor="pointer"
                onClick={() => {
                  setCurrentDashboard(dashboard);
                  navigate({ to: "/dashboards/form", search: { edit: true } });
                }}
              >
                <Td>{dashboard.id}</Td>
                <Td>{dashboard.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default Dashboards;
