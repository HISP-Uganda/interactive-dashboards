import { Route } from "@tanstack/react-location";
import Categories from "./components/Categories";
import Dashboard from "./components/Dashboard";
import Dashboards from "./components/Dashboards";
import DataSources from "./components/DataSources";
import {
  CategoryForm,
  DataSourceForm,
  IndicatorForm,
} from "./components/forms";
import Home from "./components/Home";
import Indicators from "./components/Indicators";
import Section from "./components/Section";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/categories",
    children: [
      { path: "/", element: <Categories /> },
      { path: "form", element: <CategoryForm /> },
    ],
  },
  {
    path: "/data-sources",
    children: [
      { path: "/", element: <DataSources /> },
      { path: "form", element: <DataSourceForm /> },
    ],
  },
  {
    path: "/dashboards",
    children: [
      { path: "/", element: <Dashboards /> },
      { path: "form", element: <Dashboard /> },
      { path: "section", element: <Section /> },
    ],
  },
  {
    path: "/indicators",
    children: [
      {
        path: "/",
        element: <Indicators />,
      },
      {
        path: "form",
        element: <IndicatorForm />,
      },
    ],
  },
];
