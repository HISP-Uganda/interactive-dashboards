import {
  Box,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Stack,
  Text,
  Image,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import {
  createHashHistory,
  MakeGenerics,
  Outlet,
  parseSearchWith,
  ReactLocation,
  Router,
  stringifySearchWith,
} from "@tanstack/react-location";
import { useStore } from "effector-react";
import {
  CategoryForm,
  DashboardForm,
  DataSourceForm,
  IndicatorForm,
} from "../components/forms";
import Denominator from "../components/forms/Denominator";
import Numerator from "../components/forms/Numerator";
import Home from "../components/Home";
import {
  Categories,
  Dashboards,
  DataSources,
  Indicators,
} from "../components/lists";
import DashboardCategories from "../components/lists/DashboardCategories";
import Section from "../components/Section";
import {
  setCategory,
  setCurrentDashboard,
  setCurrentPage,
  setDataSource,
  setIndicator,
} from "../Events";
import { useInitials } from "../Queries";
import {
  $categories,
  $dashboards,
  $dataSources,
  $indicators,
  $store,
  createCategory,
  createDashboard,
  createDataSource,
  createIndicator,
} from "../Store";
import { decodeFromBinary, encodeToBinary } from "../utils/utils";
import DashboardMenu from "./DashboardMenu";
import Menus from "./Menus";
import moh from "../images/moh.json";
import who from "../images/who.json";
import hisp from "../images/hisp.json";
import SidebarContent from "./SidebarContent";
import HAndWAware from "./HAndWAware";
import SectionMenu from "./SectionMenu";

const history = createHashHistory();
const location = new ReactLocation<
  MakeGenerics<{
    LoaderData: {};
  }>
>({
  history,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
});
const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();
  const store = useStore($store);
  const dashboards = useStore($dashboards);
  const dataSources = useStore($dataSources);
  const indicators = useStore($indicators);
  const categories = useStore($categories);

  const topMenuOptions: { [key: string]: any } = {
    dashboards: <DashboardMenu />,
    sections: <SectionMenu />,
  };

  const rowSpans2 = [1, 10, 1];
  const rowSpans = [1, 11];
  return (
    <>
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
        <Router
          location={location}
          routes={[
            {
              loader: async () => {
                setCurrentPage("");
              },
              path: "/",
              element: <Home />,
            },
            {
              loader: async () => {
                setCurrentPage("");
              },
              path: "/categories",
              children: [
                { path: "/", element: <Categories /> },
                {
                  path: ":categoryId",
                  element: <CategoryForm />,
                  loader: async ({ params: { categoryId } }) => {
                    const category = categories.find(
                      (c) => c.id === categoryId
                    );
                    if (category) {
                      setCategory(category);
                    } else {
                      setCategory(createCategory(categoryId));
                    }
                  },
                },
              ],
            },
            {
              loader: async () => {
                setCurrentPage("");
              },
              path: "/data-sources",
              children: [
                { path: "/", element: <DataSources /> },
                {
                  path: ":dataSourceId",
                  element: <DataSourceForm />,
                  loader: async ({ params: { dataSourceId } }) => {
                    const dataSource = dataSources.find(
                      (c) => c.id === dataSourceId
                    );
                    if (dataSource) {
                      setDataSource(dataSource);
                    } else {
                      setDataSource(createDataSource(dataSourceId));
                    }
                  },
                },
              ],
            },
            {
              loader: async () => {
                setCurrentPage("");
              },
              path: "/dashboards",

              children: [
                { path: "/", element: <Dashboards /> },
                {
                  path: ":dashboardId",
                  children: [
                    {
                      path: "/",
                      element: <DashboardForm />,
                      loader: async ({ params: { dashboardId } }) => {
                        setCurrentPage("dashboards");
                        const dashboard = dashboards.find(
                          (c) => c.id === dashboardId
                        );
                        if (dashboard) {
                          setCurrentDashboard(dashboard);
                        } else {
                          setCurrentDashboard(createDashboard(dashboardId));
                        }
                      },
                    },
                    {
                      path: "section",
                      element: <Section />,
                      loader: async () => {
                        setCurrentPage("sections");
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: "/dashboard-categories",
              children: [{ path: "/", element: <DashboardCategories /> }],
              loader: async () => {
                setCurrentPage("");
              },
            },
            {
              loader: async () => {
                setCurrentPage("");
              },
              path: "/indicators",
              children: [
                {
                  path: "/",
                  element: <Indicators />,
                },
                {
                  path: ":indicatorId",
                  children: [
                    {
                      path: "/",
                      element: <IndicatorForm />,
                      loader: async ({ params: { indicatorId } }) => {
                        const indicator = indicators.find(
                          (c) => c.id === indicatorId
                        );
                        if (indicator) {
                          setIndicator(indicator);
                        } else {
                          setIndicator(createIndicator(indicatorId));
                        }
                      },
                    },
                    { path: "/numerator", element: <Numerator /> },
                    { path: "/denominator", element: <Denominator /> },
                  ],
                },
              ],
            },
          ]}
        >
          <Grid
            bg="gray.300"
            // templateRows="100px 1fr"
            templateColumns="250px 1fr"
            gap={1}
            h="calc(100vh - 48px)"
            // w="100vw"
            p="5px"
          >
            <GridItem h="100%">
              <Grid templateRows="repeat(12, 1fr)" gap={1} h="100%">
                <GridItem rowSpan={rowSpans2[0]} h="100%">
                  <HAndWAware src={moh} />
                </GridItem>
                <GridItem rowSpan={rowSpans2[1]}>
                  <SidebarContent />
                </GridItem>
                <GridItem rowSpan={rowSpans2[2]} h="100%">
                  {/* <HAndWAware src={hisp} /> */}
                  <Stack
                    alignItems="center"
                    justifyItems="center"
                    justifyContent="center"
                    alignContent="center"
                    h="100%"
                  >
                    <Image
                      src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
                      alt="Ministry of Health"
                      w="100%"
                      maxWidth="110px"
                      h="auto"
                    />
                  </Stack>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem h="100%">
              <Grid templateRows="repeat(12, 1fr)" gap={1} h="100%">
                <GridItem h="100%" rowSpan={rowSpans[0]}>
                  <Grid templateColumns="1fr 250px" h="100%" gap={1}>
                    <GridItem h="100%">
                      <Stack
                        h="100%"
                        justifyContent="center"
                        alignContent="center"
                      >
                        {topMenuOptions[store.currentPage]}
                      </Stack>
                    </GridItem>
                    <GridItem>
                      {/* <HAndWAware src={who} /> */}
                      <Stack
                        alignItems="center"
                        justifyItems="center"
                        justifyContent="center"
                        alignContent="center"
                        h="100%"
                      >
                        <Image
                          src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/h-logo-blue.svg"
                          alt="Ministry of Health"
                          w="100%"
                          maxWidth="160px"
                          h="auto"
                        />
                      </Stack>
                    </GridItem>
                  </Grid>
                </GridItem>
                <GridItem rowSpan={rowSpans[1]} h="100%">
                  <Outlet />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Router>
      )}

      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default App;
