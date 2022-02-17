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
];
