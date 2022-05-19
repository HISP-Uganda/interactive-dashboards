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
import DashboardCategories from "./components/lists/DashboardCategories";
import Numerator from "./components/forms/Numerator";
import Denominator from "./components/forms/Denominator";

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
    path: "/dashboard-categories",
    children: [{ path: "/", element: <DashboardCategories /> }],
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
        children: [
          { path: "/", element: <IndicatorForm /> },
          { path: "/numerator", element: <Numerator /> },
          { path: "/denominator", element: <Denominator /> },
        ],
      },
    ],
  },
];
