import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Stack,
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
import { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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
import DashboardCategories from "../components/lists/DashboardCategories";
import Section from "../components/Section";
import {
  setCategory,
  setCurrentDashboard,
  setCurrentPage,
  setDataSource,
  setIndicator,
} from "../Events";
import moh from "../images/moh.json";
import { useInitials } from "../Queries";
import {
  $categories,
  $dashboard,
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
const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();
  const store = useStore($store);
  const dashboards = useStore($dashboards);
  const dashboard = useStore($dashboard);
  const dataSources = useStore($dataSources);
  const indicators = useStore($indicators);
  const categories = useStore($categories);
  const handle = useFullScreenHandle();

  const [mohLogo, { width, height }] = useElementSize();
  const [hispLogo, { width: hw, height: hh }] = useElementSize();
  const [hispLogo1, { width: h1w, height: h1h }] = useElementSize();
  const [funderLogo, { width: fw, height: fh }] = useElementSize();
  const [funderLogo1, { width: f1w, height: f1h }] = useElementSize();

  const topMenuOptions: { [key: string]: any } = {
    dashboards: <DashboardMenu />,
    sections: <SectionMenu />,
  };

  useEffect(() => {
    const callback = async (event: KeyboardEvent) => {
      if (event.key === "F" || event.key === "f") {
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
            templateColumns="250px 1fr"
            gap={1}
            maxH="calc(100vh - 48px)"
            h="calc(100vh - 48px)"
            p="5px"
            
          >
            <GridItem h="100%"  >
              <Grid templateRows="repeat(14, 1fr)" gap={1} h="100%" >
                <GridItem rowSpan={1} h="100%">
                  <Stack
                    h="100%"
                    w="100%"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="center"
                    justifyItems="center"
                    ref={mohLogo}
                  >
                    <Image
                      src={moh}
                      maxH={`${height * 0.7}px`}
                      maxW={`${width * 0.7}px`}
                    />
                  </Stack>
                </GridItem>
                <GridItem rowSpan={12} h="100%">
                  <SidebarContent />
                </GridItem>
                <GridItem rowSpan={1} h="100%">
                  <Stack
                    h="100%"
                    w="100%"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="center"
                    justifyItems="center"
                    ref={hispLogo}
                  >
                    <Image
                      src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
                      maxH={`${hh * 0.7}px`}
                      maxW={`${hw * 0.7}px`}
                    />
                  </Stack>
                </GridItem>
              </Grid>
            </GridItem>
            <FullScreen handle={handle}>
              <GridItem
                h="100%"
                bg={handle.active ? "gray.300" : ""}
                p={handle.active ? "5px" : ""}
                maxH={handle.active ? "100vh" : "calc(100vh - 48px)"}
                w="100%"
              >
                <Grid templateRows="repeat(14, 1fr)" gap={1} h="100%">
                  <GridItem h="100%" w="100%" rowSpan={1}>
                    <Stack
                      h="100%"
                      justifyContent="center"
                      alignContent="center"
                      direction="row"
                      w="100%"
                      spacing="40px"
                      ref={hispLogo1}
                    >
                      {handle.active && (
                        <Stack
                          alignContent="center"
                          alignItems="center"
                          justifyContent="center"
                          justifyItems="center"
                        >
                          <Image
                            src={moh}
                            maxH={`${h1h * 0.85}px`}
                            maxW={`${h1w * 0.85}px`}
                          />
                        </Stack>
                      )}
                      {topMenuOptions[store.currentPage]}
                    </Stack>
                  </GridItem>
                  <GridItem rowSpan={12} h="100%">
                    <Outlet />
                  </GridItem>
                  <Footer
                    //funderLogoRef={funderLogo}
                    funderLogo1Ref={funderLogo1}
                    handle={handle}
                    fh={fh}
                    fw={fw}
                    f1h={f1h}
                    f1w={f1w}
                  />
                </Grid>
              </GridItem>
            </FullScreen>
          </Grid>
        </Router>
      )}

      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default App;
