import { Box, useMediaQuery } from "@chakra-ui/react";
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
import { sizeApi, storeApi } from "../Events";
import { LocationGenerics, ScreenSize } from "../interfaces";
import { useInitials } from "../Queries";
import { $settings } from "../Store";
import {
    decodeFromBinary,
    encodeToBinary,
    setHeaderbarVisible,
} from "../utils/utils";
import DashboardTemplateForm from "./forms/DashboardTemplateForm";
import PresentationForm from "./forms/PresentationForm";
import Presenter from "./forms/Presenter";
import ReportDesignForm from "./forms/ReportDesignForm";
import ReportForm from "./forms/ReportForm";
import ReportView from "./forms/ReportView";
import Presentations from "./lists/Presentations";
import Reports from "./lists/Reports";
import LoadingIndicator from "./LoadingIndicator";
import Settings from "./Settings";

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
            path: "/",
            element: <Home />,
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
                        },
                        {
                            path: ":categoryId",
                            element: <CategoryForm />,
                        },
                    ],
                },
                {
                    path: "/data-sources",
                    children: [
                        {
                            path: "/",
                            element: <DataSources />,
                        },
                        {
                            path: ":dataSourceId",
                            element: <DataSourceForm />,
                        },
                    ],
                },
                {
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
                        },
                        {
                            path: ":visualizationQueryId",
                            children: [
                                {
                                    path: "/",
                                    element: <VisualizationQueryForm />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/presentations",
                    children: [
                        {
                            path: "/",
                            element: <Presentations />,
                        },
                        {
                            path: ":presentationId",
                            children: [
                                {
                                    path: "/",
                                    element: <PresentationForm />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/reports",
                    children: [
                        {
                            path: "/",
                            element: <Reports />,
                            loader: () => {
                                setHeaderbarVisible(true);
                                return {};
                            },
                        },
                        {
                            path: ":reportId",
                            children: [
                                {
                                    path: "/",
                                    element: <ReportForm />,
                                },
                                {
                                    path: "/design",
                                    element: <ReportDesignForm />,
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
                        },
                    ],
                },
            ],
        },
        {
            path: "/presentations/:presentationId",
            children: [
                {
                    path: "/",
                    element: <Presenter />,
                },
            ],
        },
        {
            path: "/reports/:reportId",
            children: [
                {
                    path: "/",
                    element: <ReportView />,
                },
            ],
        },
        {
            path: "/dashboards/:dashboardId",
            children: [
                {
                    path: "/",
                    element: <DashboardForm />,
                },
            ],
        },
        {
            path: "/templates/:templateId",
            element: <DashboardTemplateForm />,
            children: [
                {
                    path: ":dashboardId",
                    element: <DashboardForm />,
                },
            ],
        },
        {
            element: <Home />,
        },
    ];

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && (
                <Router
                    location={location}
                    routes={routes}
                    defaultPendingElement={<LoadingIndicator />}
                >
                    <Outlet />
                </Router>
            )}

            {isError && <Box>{error?.message}</Box>}
        </>
    );
};

export default App;
