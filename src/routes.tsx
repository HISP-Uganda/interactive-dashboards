import Categories from "./components/Categories";
import Dashboard from "./components/Dashboard";
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
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/dashboards",
    element: <Dashboards />,
    children: [
      {
        path: ":id",
        element: <Dashboard />,
      },
    ],
  },
];
