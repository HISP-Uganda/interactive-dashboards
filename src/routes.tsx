import { Route } from "@tanstack/react-location";
import {
  Categories,
  Dashboards,
  DataSources,
  Indicators,
} from "./components/lists";
import {
  CategoryForm,
  DataSourceForm,
  IndicatorForm,
  DashboardForm,
} from "./components/forms";
import Home from "./components/Home";
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
      { path: "form", element: <DashboardForm /> },
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
