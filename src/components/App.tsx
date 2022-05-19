import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  createHashHistory,
  MakeGenerics,
  Outlet,
  parseSearchWith,
  ReactLocation,
  Router,
  stringifySearchWith,
  useNavigate,
} from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useInitials } from "../Queries";
import { routes } from "../routes";
import { $store } from "../Store";
import { decodeFromBinary, encodeToBinary } from "../utils/utils";
import Menus from "./Menus";

type LocationGenerics = MakeGenerics<{
  LoaderData: {};
}>;

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
  history,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
});

const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();
  const store = useStore($store);
  return (
    <Stack>
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
          <Stack h="calc(100vh - 48px)" direction="row" spacing="0">
            {store.showSider && (
              <Stack
                w="128px"
                alignItems="center"
                alignContent="center"
                bg="gray.100"
              >
                <Menus />
              </Stack>
            )}
            <Outlet />
          </Stack>
        </Router>
      )}

      {isError && <Box>{error.message}</Box>}
    </Stack>
  );
};

export default App;
