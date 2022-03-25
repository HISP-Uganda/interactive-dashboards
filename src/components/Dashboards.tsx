import { Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Outlet, useNavigate, useMatchRoute } from "react-location";
import { $store } from "../Store";
import NewDashboardDialog from "./NewDashboardDialog";
const Dashboards = () => {
  const store = useStore($store);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  return matchRoute({ to: "/dashboards" }) !== undefined ? (
    <Stack>
      <NewDashboardDialog />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {store.dashboards.map((dashboard: string) => (
            <Tr
              key={dashboard}
              cursor="pointer"
              onClick={() => navigate({ to: `./${dashboard}` })}
            >
              <Td>{dashboard}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  ) : (
    <Outlet />
  );
};

export default Dashboards;
