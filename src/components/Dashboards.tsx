import { useStore } from "effector-react";
import { Outlet } from "react-location";
import { $store } from "../Store";
const Dashboards = () => {
  const store = useStore($store)
  return (
    <div>
      <Outlet/>
    </div>
  );
};

export default Dashboards;
