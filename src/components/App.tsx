import { Box, Flex, Spinner } from "@chakra-ui/react";
import {
  createHashHistory,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
} from "react-location";
import { useInitials } from "../Queries";
import { routes } from "../routes";

type LocationGenerics = MakeGenerics<{
  LoaderData: {};
}>;

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({ history });

const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();

  return (
    <Box>
      {isLoading && (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 48px)"
        >
          <Spinner />
        </Flex>
      )}
      {isSuccess && (
        <Router location={location} routes={routes}>
          <Outlet />
        </Router>
      )}
      {isError && <Box>{error.message}</Box>}
    </Box>
  );
};

export default App;
