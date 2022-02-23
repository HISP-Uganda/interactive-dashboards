import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Outlet } from "react-location";
import { $store } from "../Store";
const Dashboards = () => {
  const store = useStore($store);
  return <Outlet />;
};

export default Dashboards;
