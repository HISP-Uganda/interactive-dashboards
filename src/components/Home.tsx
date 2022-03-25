import { Flex, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Navigate } from "react-location";
import { $store } from "../Store";
import NewDataSourceDialog from "./NewDataSourceDialog";

export default function Home() {
  const store = useStore($store);
  return (
    <Stack>
      {!!store.dashboard ? (
        <Navigate to={`/dashboards/${store.dashboard.id}`} />
      ) : (
        <Stack direction="row">
          <NewDataSourceDialog />
        </Stack>
      )}
    </Stack>
  );
}
