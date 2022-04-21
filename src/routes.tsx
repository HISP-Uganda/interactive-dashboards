import { Route } from "react-location";
import Categories from "./components/Categories";
import Dashboard from "./components/Dashboard";
import Dashboards from "./components/Dashboards";
import VisualizationQueryForm from "./components/data-sources/VisualizationQueryForm";
import DataSources from "./components/DataSources";
import Home from "./components/Home";
import VisualizationQueries from "./components/VisualizationQueries";
import VisualizationQuery from "./components/VisualizationQuery";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/data-sources",
    element: <DataSources />,
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
  {
    path: "/visualization-queries",
    children: [
      {
        path: "/",
        element: <VisualizationQueries />,
      },
      {
        path: "form",
        element: <VisualizationQueryForm />,
      },
    ],
  },
];
