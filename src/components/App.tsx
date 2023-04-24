import { Box, Flex, useMediaQuery, Spinner } from "@chakra-ui/react";
import {
    createHashHistory,
    Outlet,
    parseSearchWith,
    ReactLocation,
    Route,
    Router,
    stringifySearchWith,
} from "@tanstack/react-location";
import { useEffect } from "react";
import { useFullScreenHandle } from "react-full-screen";
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
    setCurrentPage,
    setIsFullScreen,
    setIsNotDesktop,
    setShowFooter,
    setShowSider,
} from "../Events";
import { LocationGenerics, ScreenSize } from "../interfaces";
import { useInitials } from "../Queries";
import { decodeFromBinary, encodeToBinary } from "../utils/utils";
import LoadingIndicator from "./LoadingIndicator";
import Settings from "./Settings";
import { useStore } from "effector-react";
import { $settings, sizeApi } from "../Store";
import Panel from "./Panel";

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
    history,
    parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
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
    const { isLoading, isSuccess, isError, error } = useInitials(storage);
    const handle = useFullScreenHandle();
    const [isNotDesktop] = useMediaQuery(["(max-width: 992px)"]);

    const [phone, tablet, laptop, desktop] = useMediaQuery([
        "(max-width: 768px)",
        "(min-width: 768px)",
        "(min-width: 992px)",
        "(min-width: 1200px)",
    ]);

    useEffect(() => {
        setIsNotDesktop(isNotDesktop);
    }, [isNotDesktop]);

    useEffect(() => {
        const index = [phone, tablet, laptop, desktop].lastIndexOf(true);
        if (index >= 0 && index <= 3) {
            sizeApi.set(sizes[index]);
        }
    }, [phone, tablet, laptop, desktop]);

    useEffect(() => {
        const callback = async (event: KeyboardEvent) => {
            if (event.key === "F5" || event.key === "f5") {
                await handle.enter();
                if (handle.active) {
                    setIsFullScreen(true);
                } else {
                    setShowSider(true);
                    setIsFullScreen(true);
                }
            }
        };
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, []);

    const routes: Route<LocationGenerics>[] = [
        {
            loader: async () => {
                setCurrentPage("");
                return {};
            },
            path: "/",
            element: <Home />,
        },
        {
            loader: async () => {
                setCurrentPage("");
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
                                setCurrentPage("categories");
                                setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":categoryId",
                            element: <CategoryForm />,
                            loader: () => {
                                setCurrentPage("category");
                                setShowFooter(false);
                                setShowSider(true);
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
                                setCurrentPage("data-sources");
                                setShowFooter(false);
                                setShowSider(true);
                                return {};
                            },
                        },
                        {
                            path: ":dataSourceId",
                            element: <DataSourceForm />,
                            loader: () => {
                                setCurrentPage("data-source");
                                setShowFooter(false);
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
                                setCurrentPage("indicators");
                                setShowFooter(false);
                                setShowSider(true);
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
                                        setShowFooter(false);
                                        setCurrentPage("indicator");
                                        setShowSider(true);
                                        return {};
                                    },
                                },
                                { path: "/numerator", element: <Numerator /> },
                                {
                                    path: "/denominator",
                                    element: <Denominator />,
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
                                setCurrentPage("dashboards");
                                setShowFooter(false);
                                setShowSider(true);
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
                        setCurrentPage("dashboard");
                        setShowFooter(true);
                        setShowSider(true);
                        return {};
                    },
                },
                {
                    path: "section",
                    element: <Section />,
                    loader: async () => {
                        setCurrentPage("sections");
                        setShowFooter(false);
                        return {};
                    },
                },
            ],
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
