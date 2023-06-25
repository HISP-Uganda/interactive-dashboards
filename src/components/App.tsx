import { Box, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import {
    createHashHistory,
    Outlet,
    parseSearchWith,
    ReactLocation,
    Route,
    Router,
    stringifySearchWith,
} from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useEffect } from "react";
import {
    CategoryForm,
    DashboardForm,
    DataSourceForm,
    IndicatorForm,
    VisualizationQueryForm,
} from "../components/forms";
import Home from "../components/Home";
import {
    Categories,
    Dashboards,
    DataSources,
    Indicators,
    VisualizationQueries,
} from "../components/lists";
import Section from "../components/Section";
import { sizeApi, storeApi } from "../Events";
import { LocationGenerics, ScreenSize } from "../interfaces";
import { useInitials } from "../Queries";
import { $settings } from "../Store";
import { decodeFromBinary, encodeToBinary } from "../utils/utils";
import Panel from "./Panel";
import Settings from "./Settings";
import PDF from "./PDF";
// import IndicatorForm from "./forms/IndicatorForm";

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
    history,
    parseSearch: parseSearchWith((value) =>
        JSON.parse(decodeFromBinary(value))
    ),
    stringifySearch: stringifySearchWith((value) =>
        encodeToBinary(JSON.stringify(value))
    ),
});

const sizes: { [k: number]: ScreenSize } = {
    0: "xs",
    1: "sm",
    2: "md",
    3: "lg",
};

const App = () => {
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useInitials(storage);
    const [isNotDesktop] = useMediaQuery(["(max-width: 992px)"]);

    const [phone, tablet, laptop, desktop] = useMediaQuery([
        "(max-width: 768px)",
        "(min-width: 768px)",
        "(min-width: 992px)",
        "(min-width: 1200px)",
    ]);

    useEffect(() => {
        storeApi.setIsNotDesktop(isNotDesktop);
    }, [isNotDesktop]);

    useEffect(() => {
        const index = [phone, tablet, laptop, desktop].lastIndexOf(true);
        if (index >= 0 && index <= 3) {
            sizeApi.set(sizes[index]);
        }
    }, [phone, tablet, laptop, desktop]);

    const routes: Route<LocationGenerics>[] = [
        {
            loader: async () => {
                storeApi.setCurrentPage("");
                return {};
            },
            path: "/",
            element: <Home />,
        },
        {
            loader: async () => {
                storeApi.setCurrentPage("");
                return {};
            },
            path: "/panel",
            element: <Panel />,
        },
        {
            path: "/settings",
            element: <Settings />,
            children: [
                {
                    path: "/",
                    element: "Testing data",
                },
                {
                    path: "/categories",
                    children: [
                        {
                            path: "/",
                            element: <Categories />,
                            loader: async () => {
                                storeApi.setCurrentPage("categories");
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":categoryId",
                            element: <CategoryForm />,
                            loader: () => {
                                storeApi.setCurrentPage("category");
                                storeApi.setShowFooter(false);
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                    ],
                },
                {
                    path: "/data-sources",
                    children: [
                        {
                            path: "/",
                            element: <DataSources />,
                            loader: () => {
                                storeApi.setCurrentPage("data-sources");
                                storeApi.setShowFooter(false);
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":dataSourceId",
                            element: <DataSourceForm />,
                            loader: () => {
                                storeApi.setCurrentPage("data-source");
                                storeApi.setShowFooter(false);
                                return {};
                            },
                        },
                    ],
                },
                {
                    path: "/indicators",
                    children: [
                        {
                            path: "/",
                            element: <Indicators />,
                            loader: () => {
                                storeApi.setCurrentPage("indicators");
                                storeApi.setShowFooter(false);
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":indicatorId",
                            children: [
                                {
                                    path: "/",
                                    element: <IndicatorForm />,
                                    loader: () => {
                                        storeApi.setShowFooter(false);
                                        storeApi.setCurrentPage("indicator");
                                        storeApi.setShowSider(true);
                                        return {};
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/visualization-queries",
                    children: [
                        {
                            path: "/",
                            element: <VisualizationQueries />,
                            loader: () => {
                                storeApi.setCurrentPage(
                                    "visualization-queries"
                                );
                                storeApi.setShowFooter(false);
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":visualizationQueryId",
                            children: [
                                {
                                    path: "/",
                                    element: <VisualizationQueryForm />,
                                    loader: () => {
                                        storeApi.setShowFooter(false);
                                        storeApi.setCurrentPage(
                                            "visualization-query"
                                        );
                                        storeApi.setShowSider(true);
                                        return {};
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/dashboards",
                    children: [
                        {
                            path: "/",
                            element: <Dashboards />,
                            loader: () => {
                                storeApi.setCurrentPage("dashboards");
                                storeApi.setShowFooter(false);
                                storeApi.setShowSider(true);
                                return {};
                            },
                        },
                    ],
                },
            ],
        },
        {
            path: "/dashboards/:dashboardId",
            children: [
                {
                    path: "/",
                    element: <DashboardForm />,
                    loader: () => {
                        storeApi.setCurrentPage("dashboard");
                        storeApi.setShowFooter(true);
                        storeApi.setShowSider(true);
                        return {};
                    },
                },
                {
                    path: "section",
                    element: <Section />,
                    loader: async () => {
                        storeApi.setCurrentPage("sections");
                        storeApi.setShowFooter(false);
                        return {};
                    },
                },
            ],
        },
        {
            element: <Home />,
        },
    ];

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
                    routes={routes}
                    defaultPendingElement={<Spinner />}
                >
                    <Outlet />
                </Router>
            )}

            {isError && <Box>{error?.message}</Box>}
        </>
    );
};

export default App;
