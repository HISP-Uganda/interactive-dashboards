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
import { IDashboard } from "../interfaces";
import { useNamespace } from "../Queries";
import NewDashboardDialog from "./dialogs/NewDashboardDialog";

const Dashboards = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-dashboards");
  return (
    <Stack flex={1} p="10px">
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
            {data.map((dashboard: IDashboard) => (
              <Tr
                key={dashboard.id}
                cursor="pointer"
                onClick={() => navigate({ to: `./${dashboard.id}` })}
              >
                <Td>{dashboard.id}</Td>
                <Td>{dashboard.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default Dashboards;
