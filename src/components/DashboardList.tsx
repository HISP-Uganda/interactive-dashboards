import {
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-location";
import { IDashboard } from "../interfaces";
import { useNamespace } from "../Queries";
import NewDashboardDialog from "./dialogs/NewDashboardDialog";

const DashboardList = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-dashboards");
  return (
    <Stack>
      <NewDashboardDialog />
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

export default DashboardList;
