import { Outlet, useMatchRoute } from "react-location";
import DashboardList from "./DashboardList";
const Dashboards = () => {
  const matchRoute = useMatchRoute();
  return matchRoute({ to: "/dashboards" }) !== undefined ? (
    <DashboardList />
  ) : (
    <Outlet />
  );
};

export default Dashboards;
