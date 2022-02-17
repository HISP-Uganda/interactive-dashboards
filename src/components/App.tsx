import { Box } from "@chakra-ui/react";
import {
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  createHashHistory,
  Link,
} from "react-location";
import { routes } from "../routes";

type LocationGenerics = MakeGenerics<{
  LoaderData: {};
}>;

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({ history });

const MyApp = () => (
  <Box bg="yellow.400">
    <Router location={location} routes={routes}>
      <Link to="./village">Village</Link>
      <Outlet />
    </Router>
  </Box>
);

export default MyApp;
