import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../Store";
import NewCategoryDialog from "./NewCategoryDialog";
import NewDashboardDialog from "./NewDashboardDialog";

export default function Home() {
  const store = useStore($store);

  return (
    <Stack direction="row" spacing="10px">
      <NewCategoryDialog />
      <NewDashboardDialog />
    </Stack>
  );
}
