import Dashboards from "./components/Dashboards";
import Home from "./components/Home";
import Village from "./components/Village";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/village",
    element: <Village />,
  },
  {
    path: "/dashboards",
    element: <Dashboards />,
  },
];
