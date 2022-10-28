import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
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
import { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useElementSize } from "usehooks-ts";
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
import Section from "../components/Section";
import {
  setCategory,
  setCurrentDashboard,
  setCurrentPage,
  setDataSource,
  setIndicator,
  setShowFooter,
  setShowSider,
  setTargetCategoryOptionCombos,
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
import Footer from "./Footer";
import MOHLogo from "./MOHLogo";
import MOHLogo2 from "./MOHLogo2";
import SectionMenu from "./SectionMenu";
import SidebarContent from "./SidebarContent";

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
const padding = 5;
const sideWidth = 250;
const maxDashboardHeight = 5 * 2 + 48;
const realHeight = `calc(100vh - ${maxDashboardHeight}px)`;
const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();
  const store = useStore($store);
  const dashboards = useStore($dashboards);
  const dataSources = useStore($dataSources);
  const indicators = useStore($indicators);
  const categories = useStore($categories);
  const handle = useFullScreenHandle();

  const engine = useDataEngine();

  const topMenuOptions: { [key: string]: any } = {
    dashboard: <DashboardMenu />,
    sections: <SectionMenu />,
  };

  const [columns, setColumns] = useState<string>(`${sideWidth}px 1fr`);
  const [dashboardWidth, setDashboardWidth] = useState<string>(
    `calc(100vw - ${250 + padding * 2}px)`
  );

  useEffect(() => {
    if (store.showSider) {
      setColumns((prev) => `${250}px 1fr`);
      setDashboardWidth(() => `calc(100vw - ${250 + padding * 2}px)`);
    } else {
      setColumns(() => "1fr");
      setDashboardWidth(() => `100vw - ${padding * 2}px`);
    }
  }, [store.showSider]);

  useEffect(() => {
    const callback = async (event: KeyboardEvent) => {
      if (event.key === "F5" || event.key === "f5") {
        setDashboardWidth(() => "100wv");
        await handle.enter();
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);

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
              path: "/categories",
              loader: async () => {
                setCurrentPage("categories");
                setShowSider(true);
              },
              children: [
                { path: "/", element: <Categories /> },
                {
                  path: ":categoryId",
                  element: <CategoryForm />,
                  loader: async ({ params: { categoryId } }) => {
                    setCurrentPage("category");
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
                setCurrentPage("data-sources");
                setShowFooter(false);
                setShowSider(true);
              },
              path: "/data-sources",
              children: [
                { path: "/", element: <DataSources /> },
                {
                  path: ":dataSourceId",
                  element: <DataSourceForm />,
                  loader: async ({ params: { dataSourceId } }) => {
                    setCurrentPage("data-source");
                    setShowFooter(false);
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
              path: "/dashboards",
              loader: async () => {
                setCurrentPage("dashboards");
                setShowFooter(false);
                setShowSider(true);
                11211;
              },
              children: [
                { path: "/", element: <Dashboards /> },
                {
                  path: ":dashboardId",
                  children: [
                    {
                      path: "/",
                      element: <DashboardForm />,
                      loader: async ({ params: { dashboardId } }) => {
                        setCurrentPage("dashboard");
                        setShowFooter(true);
                        const dashboard = dashboards.find(
                          (c) => c.id === dashboardId
                        );
                        if (dashboard) {
                          setCurrentDashboard(dashboard);
                          if (dashboard.targetCategoryCombo) {
                            const {
                              combo: { categoryOptionCombos },
                            }: any = await engine.query({
                              combo: {
                                resource: `categoryCombos/${dashboard.targetCategoryCombo}`,
                                params: {
                                  fields:
                                    "categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]",
                                },
                              },
                            });
                            setTargetCategoryOptionCombos(categoryOptionCombos);
                          }
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
                        setShowFooter(false);
                      },
                    },
                  ],
                },
              ],
            },
            {
              loader: async () => {
                setCurrentPage("indicators");
                setShowFooter(false);
                setShowSider(true);
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
                        setShowFooter(false);
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
            templateColumns={columns}
            maxH="calc(100vh - 48px)"
            h="calc(100vh - 48px)"
            p="5px"
            w="100vw"
            maxW="100vw"
          >
            {store.showSider && (
              <Grid
                templateRows="48px 1fr 48px"
                pr="5px"
                gap="5px"
                h={realHeight}
                maxH={realHeight}
              >
                <Stack
                  h="100%"
                  w="100%"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  justifyItems="center"
                >
                  <MOHLogo height={48} width={250} />
                </Stack>
                <GridItem>
                  <SidebarContent />
                </GridItem>
                <Stack
                  h="100%"
                  w="100%"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  justifyItems="center"
                >
                  <Image
                    src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
                    maxH="48px"
                    maxW="250px"
                  />
                </Stack>
              </Grid>
            )}
            <FullScreen handle={handle}>
              <Grid
                templateRows="48px 1fr 48px"
                gap="5px"
                w={dashboardWidth}
                maxW={dashboardWidth}
                h={handle.active ? "100vh" : realHeight}
                maxH={handle.active ? "100vh" : realHeight}
                bg={handle.active ? "gray.300" : ""}
              >
                <GridItem h="100%" w="100%" bg="white">
                  <Stack
                    h="100%"
                    alignContent="center"
                    alignItems="center"
                    direction="row"
                    w="100%"
                    spacing="40px"
                  >
                    {(handle.active || !store.showSider) && (
                      <MOHLogo2>
                        <Image
                          src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/Coat_of_arms_of_Uganda.svg"
                          maxH="48px"
                          maxW="250px"
                        />
                      </MOHLogo2>
                    )}
                    {!handle.active && !store.showSider && (
                      <IconButton
                        bg="none"
                        aria-label="Search database"
                        icon={<BiArrowToRight />}
                        onClick={() => setShowSider(true)}
                        _hover={{ bg: "none" }}
                      />
                    )}
                    {!handle.active && store.showSider && (
                      <IconButton
                        bg="none"
                        aria-label="Search database"
                        icon={<BiArrowToLeft />}
                        onClick={() => setShowSider(false)}
                        _hover={{ bg: "none" }}
                      />
                    )}
                    {topMenuOptions[store.currentPage]}
                  </Stack>
                </GridItem>
                <GridItem>
                  <Outlet />
                </GridItem>
                <GridItem w={dashboardWidth} maxW={dashboardWidth}>
                  <Footer handle={handle} />
                </GridItem>
              </Grid>
            </FullScreen>
          </Grid>
        </Router>
      )}

      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default App;
