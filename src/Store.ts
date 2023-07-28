import axios from "axios";
import { combine, createApi } from "effector";
import { isEmpty, isEqual, sortBy } from "lodash";
import { headerHeight, padding, sideWidth } from "./components/constants";
import { domain } from "./Domain";
import {
    ICategory,
    IDashboard,
    IDashboardSetting,
    IData,
    IDataSource,
    IIndicator,
    IPagination,
    ISection,
    IStore,
    Option,
    Playlist,
    ScreenSize,
    DataNode,
} from "./interfaces";
import { generateUid } from "./utils/uid";
import {
    getRelativePeriods,
    relativePeriods2,
    createAxios,
} from "./utils/utils";
export const createSection = (id = generateUid()): ISection => {
    return {
        id,
        rowSpan: 1,
        colSpan: 1,
        title: "Section Name",
        visualizations: [],
        direction: "row",
        display: "normal",
        justifyContent: "space-around",
        carouselOver: "items",
        bg: "white",
        height: "100%",
        padding: "5px",
        headerBg: "",
        lg: {
            x: 0,
            y: 0,
            w: 2,
            h: 2,
            i: id,
            static: false,
        },
        md: {
            x: 0,
            y: 0,
            w: 2,
            h: 2,
            i: id,
            static: false,
        },
        sm: {
            x: 0,
            y: 0,
            w: 2,
            h: 2,
            i: id,
            static: false,
        },
        xs: {
            x: 0,
            y: 0,
            w: 2,
            h: 2,
            i: id,
            static: false,
        },
    };
};

export const createCategory = (id = generateUid()): ICategory => {
    return {
        id,
        name: "",
        description: "",
    };
};

export const createDataSource = (id = generateUid()): IDataSource => {
    return {
        id,
        type: "DHIS2",
        authentication: {
            url: "",
            username: "",
            password: "",
        },
        isCurrentDHIS2: true,
    };
};

export const createVisualizationQuery = (id = generateUid()): IData => {
    return {
        id,
        type: "ANALYTICS",
        name: "Example Query",
        description: "",
        dataDimensions: {},
        dataSource: undefined,
    };
};

export const $visualizationQuery = domain.createStore<IData>(
    createVisualizationQuery()
);

export const createIndicator = (id = generateUid()): IIndicator => {
    return {
        id,
        numerator: undefined,
        denominator: undefined,
        name: "",
        description: "",
        factor: "1",
        query: "",
        custom: false,
    };
};

export const createDashboard = (
    id = generateUid(),
    type: "dynamic" | "fixed" = "dynamic"
): IDashboard => {
    return {
        id,
        sections: [],
        published: false,
        rows: 24,
        columns: 24,
        category: "uDWxMNyXZeo",
        name: "New Dashboard",
        refreshInterval: "off",
        dataSet: "",
        categorization: {},
        availableCategories: [],
        availableCategoryOptionCombos: [],
        bg: "gray.300",
        targetCategoryCombo: "",
        targetCategoryOptionCombos: [],
        nodeSource: {},
        tag: "Example tag",
        type,
        excludeFromList: false,
    };
};
export const $dashboardType = domain.createStore<"fixed" | "dynamic">("fixed");

export const $paginations = domain.createStore<IPagination>({
    totalDataElements: 0,
    totalSQLViews: 0,
    totalIndicators: 0,
    totalProgramIndicators: 0,
    totalOrganisationUnitLevels: 0,
    totalOrganisationUnitGroups: 0,
    totalOrganisationUnitGroupSets: 0,
    totalDataElementGroups: 0,
    totalDataElementGroupSets: 0,
});

export const $filters = domain.createStore<{ [key: string]: any }>({});

export const $size = domain.createStore<ScreenSize>("md");

export const $settings = domain.createStore<IDashboardSetting>({
    defaultDashboard: "",
    storage: "data-store",
    name: "",
    id: generateUid(),
});

export const $store = domain.createStore<IStore>({
    showSider: false,
    periods: [{ value: "THIS_YEAR", label: "This year", type: "relative" }],
    organisations: [],
    levels: [],
    groups: [],
    expandedKeys: [],
    selectedCategory: "",
    selectedDashboard: "",
    isAdmin: false,
    hasDashboards: false,
    defaultDashboard: "",
    currentPage: "",
    logo: "",
    systemId: "",
    checkedKeys: [],
    showFooter: false,
    systemName: "",
    minSublevel: 2,
    maxLevel: 5,
    instanceBaseUrl: "",
    isNotDesktop: false,
    isFullScreen: false,
    refresh: true,
    themes: [],
    dataElements: [],
    version: "",
    rows: [],
    columns: [],
    originalColumns: [],
    dataElementGroups: [],
    dataElementGroupSets: [],
    selectedKeys: [],
});
export const $dataSource = domain.createStore<IDataSource>(createDataSource());
export const $category = domain.createStore<ICategory>(createCategory());
export const $dashboard = domain.createStore<IDashboard>(createDashboard());
export const $dashboards = domain.createStore<IDashboard[]>([]);
export const $indicators = domain.createStore<IIndicator[]>([]);
export const $categories = domain.createStore<ICategory[]>([]);
export const $dataSources = domain.createStore<IDataSource[]>([]);
export const $indicator = domain.createStore<IIndicator>(createIndicator());
export const $section = domain.createStore<ISection>(createSection());
export const $dataSets = domain.createStore<Option[]>([]);
export const $calculated = domain.createStore<{ [key: string]: any }>({});

// export const $currentDataSource = combine(
//     $visualizationQuery,
//     $dataSources,
//     (visualizationQuery, dataSources) => {
//        return createAxios(visualizationQuery)
//     }
// );

export const $categoryDashboards = combine(
    $dashboards,
    $store,
    (dashboards, store) => {
        return dashboards
            .filter(
                (dashboard) => dashboard.category === store.selectedCategory
            )
            .map((dataSource) => {
                const current: Option = {
                    value: dataSource.id,
                    label: dataSource.name || "",
                };
                return current;
            });
    }
);

export const $categoryDashboardTree = combine(
    $dashboards,
    $categories,
    (dashboards, categories) => {
        return categories.map(({ id, name }) => {
            const node: DataNode = {
                id,
                pId: "",
                title: name,
                nodeSource: {},
                key: id,
                children: dashboards
                    .filter((d) => d.category === id)
                    .map(({ id: dId, name: dName }) => {
                        const node2: DataNode = {
                            pId: id,
                            title: dName,
                            nodeSource: {},
                            key: dId,
                            id: dId,
                        };
                        return node2;
                    }),
            };

            return node;
        });
    }
);
export const $dataSourceOptions = $dataSources.map((state) => {
    return state.map((dataSource) => {
        const current: Option = {
            value: dataSource.id,
            label: dataSource.name || "",
        };
        return current;
    });
});

export const $categoryOptions = $categories.map((state) => {
    return state.map((category) => {
        const current: Option = {
            value: category.id,
            label: category.name || "",
        };
        return current;
    });
});

export const $visualizationData = domain.createStore<{ [key: string]: any[] }>(
    {}
);

export const $visualizationMetadata = domain.createStore<{
    [key: string]: any[];
}>({});

export const $dashboardCategory = combine(
    $dashboard,
    $categories,
    (dashboard, categories) => {
        const category: ICategory | undefined = categories.find((c) => {
            return c.id === dashboard.category;
        });
        if (category) {
            return category.name;
        }
        return "Unknown category";
    }
);

export const $categoryOptionCombo = $dashboard.map(
    ({
        availableCategories,
        categorization,
        availableCategoryOptionCombos,
    }) => {
        const combos: any[] = availableCategories
            .map(({ id }) => categorization[id])
            .filter((v) => !!v);
        let availableCombos: any[] = [];
        let result = { prev: [], current: [] };
        if (availableCategoryOptionCombos) {
            availableCombos = availableCategoryOptionCombos.map(
                ({ categoryOptions, id }: any) => {
                    return {
                        id,
                        categoryOptions: categoryOptions.map(
                            ({ id }: any) => id
                        ),
                    };
                }
            );
        }

        if (combos.length === 2) {
            const [{ categoryOptions }] = availableCategories;
            const category1 = combos[0].map(({ value }: any) => value);
            const category2 = combos[1].map(({ value }: any) => value);
            const index = categoryOptions.findIndex(
                (x: any) => category1[category1.length - 1] === x.value
            );

            if (index > 0) {
                const prevOption = categoryOptions[index - 1];

                const prev = category2.map((v: string) => {
                    const search = availableCombos.find(
                        ({ categoryOptions }: any) => {
                            return isEqual(
                                sortBy([v, prevOption.value]),
                                sortBy(categoryOptions)
                            );
                        }
                    );
                    return search?.id;
                });
                result = { ...result, prev };
            }

            const current = category1
                .flatMap((v: string) => {
                    return category2.map((v2: any) => {
                        const search = availableCombos.find(
                            ({ categoryOptions }: any) => {
                                return isEqual(
                                    sortBy([v, v2]),
                                    sortBy(categoryOptions)
                                );
                            }
                        );
                        return search?.id;
                    });
                })
                .filter((v: any) => !!v);
            result = { ...result, current };
        }
        return result;
    }
);

export const $targetCategoryOptionCombo = $dashboard.map(
    ({ categorization, availableCategories, targetCategoryOptionCombos }) => {
        if (
            availableCategories &&
            availableCategories.length > 0 &&
            targetCategoryOptionCombos &&
            targetCategoryOptionCombos.length > 0
        ) {
            const categoryId = availableCategories[0].id;
            const categories = categorization[categoryId];

            return categories.flatMap(({ value }) => {
                const targetCOC: any = targetCategoryOptionCombos.find(
                    ({ categoryOptions }) => {
                        return (
                            categoryOptions
                                .map(({ id }: any) => id)
                                .join("") === value
                        );
                    }
                );
                if (targetCOC) {
                    return [targetCOC.id];
                }
                return [];
            });
        }
        return [];
    }
);

export const $globalFilters = combine(
    $store,
    $categoryOptionCombo,
    $dashboard,
    $targetCategoryOptionCombo,
    (store, categoryOptionCombo, dashboard, target) => {
        const periods = store.periods.flatMap((period) => {
            if (period.type === "relative") {
                return getRelativePeriods(period.value).map((x: string) => x);
            }
            return [period.value];
        });
        let filters: { [key: string]: any } = {
            m5D13FqKZwN: periods,
            GQhi6pRnTKF: [store.levels.sort()[store.levels.length - 1]],
            mclvD0Z9mfT: store.organisations,
            ww1uoD3DsYg: [store.minSublevel],
        };

        if (store.groups.length > 0) {
            filters = { ...filters, of2WvtwqbHR: store.groups };
        }
        if (dashboard.dataSet && categoryOptionCombo.current.length > 0) {
            filters = {
                ...filters,
                WSiMOMi4QWh: categoryOptionCombo.current,
            };
        }
        if (dashboard.dataSet && categoryOptionCombo.prev.length > 0) {
            filters = { ...filters, IK4jwzIuqNO: categoryOptionCombo.prev };
        }
        if (dashboard.targetCategoryCombo && target.length > 0) {
            return { ...filters, OOhWJ4gfZy1: target };
        }
        if (store.dataElements.length > 0) {
            filters = {
                ...filters,
                h9oh0VhweQM: store.dataElements.map((de) => de.id),
            };
        }

        if (store.dataElementGroups.length > 0) {
            filters = {
                ...filters,
                JsPfHe1QkJe: store.dataElementGroups,
            };
        }

        if (store.dataElementGroupSets.length > 0) {
            filters = {
                ...filters,
                HdiJ61vwqTX: store.dataElementGroupSets,
            };
        }
        return filters;
    }
);

export const $dimensions = $store.map(
    ({ isNotDesktop, showSider, isFullScreen }) => {
        const maxDashboardHeight = padding * 2 + headerHeight;
        const otherHeight = padding * 4 + headerHeight * 3;
        const realHeight = `calc(100vh - ${maxDashboardHeight}px)`;
        let initial = {
            dashboardHeight: realHeight,
            dashboardWidth: `calc(100vw - ${sideWidth + padding * 2}px)`,
            dashboardColumns: `${sideWidth}px 1fr`,
            showSide: true,
            otherHeight: `calc(100vh - ${otherHeight}px)`,
            sectionHeight: `calc(100vh - ${otherHeight}px - ${headerHeight})`,
            isNotDesktop,
        };

        if (isFullScreen) {
            initial = {
                ...initial,
                showSide: false,
                dashboardWidth: `100vw - ${padding * 2}px`,
            };
        } else if (isNotDesktop) {
            initial = {
                ...initial,
                showSide: false,
                dashboardWidth: `100vw - ${padding * 2}px`,
            };
        } else if (!isNotDesktop) {
            if (showSider) {
                initial = {
                    ...initial,
                    showSide: true,
                    dashboardWidth: `calc(100vw - ${
                        sideWidth + padding * 2
                    }px)`,
                };
            } else {
                initial = {
                    ...initial,
                    showSide: false,
                    dashboardWidth: `100vw - ${padding * 2}px`,
                    dashboardColumns: "auto",
                };
            }
        }
        return initial;
    }
);

export const $hasDHIS2 = $settings.map((state) => {
    return state.storage === "data-store";
});

// export const $dataSourceType = $visualizationQuery.map((state) => {
//     return state.dataSource?.type || "";
// });
export const $isOpen = domain.createStore<boolean>(false);
export const isOpenApi = createApi($isOpen, {
    onOpen: () => true,
    onClose: () => false,
});
export const $playlist = domain.createStore<Array<Playlist>>([]);
export const playlistApi = createApi($playlist, {});
// $previousCategoryOptionCombo.watch((v) => console.log(v));
