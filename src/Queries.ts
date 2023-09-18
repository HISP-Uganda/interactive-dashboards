import { useDataEngine } from "@dhis2/app-runtime";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Event } from "effector";
import {
    every,
    flatten,
    fromPairs,
    groupBy,
    isArray,
    isEmpty,
    max,
    min,
    uniq,
} from "lodash";
import { getOr } from "lodash/fp";
import { evaluate } from "mathjs";
import { db } from "./db";
import {
    categoryApi,
    dashboardApi,
    dashboardTypeApi,
    dataSetsApi,
    dataSourceApi,
    sectionApi,
    settingsApi,
    storeApi,
    totalsApi,
    visualizationDataApi,
    visualizationDimensionsApi,
    visualizationMetadataApi,
} from "./Events";
import {
    DataNode,
    ICategory,
    IDashboard,
    IDashboardSetting,
    IData,
    IData2,
    IDataSource,
    IDimension,
    IExpressions,
    IIndicator,
    IIndicator2,
    INamed,
    IVisualization,
    IVisualization2,
    Storage,
    Threshold,
} from "./interfaces";
import { createCategory, createDashboard, createDataSource } from "./Store";
import {
    findParameters,
    flattenDHIS2Data,
    getAnalyticsQuery,
    getSearchParams,
    merge2DataSources,
    processAnalyticsData,
    processMap,
} from "./utils/utils";

type QueryProps = {
    namespace: string;
    systemId: string;
    otherQueries: any[];
    signal?: AbortSignal;
    engine: any;
};

export const api = axios.create({
    baseURL: "https://services.dhis2.hispuganda.org/",
    string: "",
});

export const fetchDataForIndex = async (
    engine: any,
    dataSource: IDataSource
) => {
    let resource: string = "events/query.json";

    let totalRows = 1;
    let page = 1;

    do {
        let params = {
            programStage: dataSource.indexDb?.programStage,
            ouMode: "ALL",
            page,
        };
        const {
            data: { headers, rows },
        }: {
            data: {
                headers: Array<{
                    name: string;
                    column: string;
                    type: string;
                    hidden: boolean;
                    meta: boolean;
                }>;
                rows: string[][];
            };
        } = await engine.query({
            data: { resource, params },
        });
        const data = rows.map((row) => {
            return fromPairs(
                row.map((value, index) => [headers[index].name, value])
            );
        });
        db.events.bulkPut(data);
        totalRows = rows.length;
        page = page + 1;
    } while (totalRows !== 0);
};

export const queryDataSource = async (
    dataSource: IDataSource,
    url = "",
    parameters: { [key: string]: any }
) => {
    const engine = useDataEngine();
    if (dataSource.type === "DHIS2" && dataSource.isCurrentDHIS2) {
        if (url) {
            const query = {
                results: {
                    resource: url,
                    params: parameters,
                },
            };
            try {
                const { results }: any = await engine.query(query);
                return results;
            } catch (error) {
                return null;
            }
        }
    }

    let params: AxiosRequestConfig = {
        baseURL: dataSource.authentication?.url,
        string: "",
    };

    if (
        dataSource.authentication &&
        dataSource.authentication.username &&
        dataSource.authentication.password
    ) {
        params = {
            ...params,
            auth: {
                username: dataSource.authentication.username,
                password: dataSource.authentication.password,
            },
        };
    }
    const instance = axios.create(params);
    const { data } = await instance.get(url, {
        params: parameters,
        string: "",
    });
    return data;
};

export const getDHIS2Index = async <TData>(
    args: Pick<QueryProps, "namespace" | "engine">
) => {
    const { engine, namespace } = args;
    const namespaceQuery = {
        namespaceKeys: {
            resource: `dataStore/${namespace}`,
        },
    };
    try {
        const { namespaceKeys }: any = await engine.query(namespaceQuery);
        const query: any = fromPairs(
            namespaceKeys.map((n: string) => [
                n,
                {
                    resource: `dataStore/${namespace}/${n}`,
                },
            ])
        );
        const response: any = await engine.query(query);
        return Object.values<TData>(response);
    } catch (error) {
        console.log(error);
    }
    return [];
};

export const getESIndex = async <TData>(args: Omit<QueryProps, "engine">) => {
    let must: any[] = [
        {
            term: { "systemId.keyword": args.systemId },
        },
        ...args.otherQueries,
    ];
    try {
        let {
            data: {
                hits: { hits },
            },
        } = await api.post<{ hits: { hits: Array<{ _source: TData }> } }>(
            "wal/search",
            {
                index: args.namespace,
                size: 1000,
                query: {
                    bool: {
                        must,
                    },
                },
            }
            // { signal: args.signal }
        );
        return hits.map(({ _source }) => _source);
    } catch (error) {
        return [];
    }
};

export const getIndex = async <TData>(
    storage: "data-store" | "es",
    args: QueryProps
) => {
    if (storage === "es") {
        return await getESIndex<TData>(args);
    }

    return await getDHIS2Index<TData>(args);
};

export const getDHIS2Record = async <TData>(
    id: string,
    args: Pick<QueryProps, "namespace" | "engine">
) => {
    const { namespace, engine } = args;
    const namespaceQuery = {
        storedValue: {
            resource: `dataStore/${namespace}/${id}`,
        },
    };
    const { storedValue } = await engine.query(namespaceQuery);
    return storedValue as TData;
};

export const getESRecord = async <TData>(
    id: string,
    args: Omit<QueryProps, "systemId" | "engine">
) => {
    let {
        data: {
            body: { _source },
        },
    } = await api.post<{ body: { _source: TData } }>("wal/get", {
        index: args.namespace,
        id,
    });
    return _source;
};

export const getOneRecord = async <TData>(
    storage: "data-store" | "es",
    id: string,
    args: QueryProps
) => {
    if (storage === "es") {
        return getESRecord<TData>(id, args);
    }
    return getDHIS2Record<TData>(id, args);
};

export const useInitials = (storage: "data-store" | "es") => {
    const engine = useDataEngine();
    const ouQuery = {
        me: {
            resource: "me.json",
            params: {
                fields: "dataViewOrganisationUnits[id,name,leaf,level],authorities,userRoles[name]",
            },
        },
        levels: {
            resource: "filledOrganisationUnitLevels.json",
            params: {
                fields: "id,level~rename(value),name~rename(label)",
            },
        },
        groups: {
            resource: "organisationUnitGroups.json",
            params: {
                fields: "id~rename(value),name~rename(label)",
            },
        },
        dataSets: {
            resource: "dataSets.json",
            params: {
                fields: "id~rename(value),name~rename(label)",
            },
        },
        systemInfo: {
            resource: "system/info",
        },
    };
    return useQuery<string, Error>(
        ["initialing"],
        async ({ signal }) => {
            const {
                systemInfo: { systemId, systemName, instanceBaseUrl },
                me: {
                    dataViewOrganisationUnits: organisationUnits,
                    authorities,
                    userRoles,
                },
                levels: organisationUnitLevels,
                groups: { organisationUnitGroups },
                dataSets: { dataSets },
            }: any = await engine.query(ouQuery);
            const isAdmin =
                authorities.indexOf("IDVT_ADMINISTRATION") !== -1 ||
                authorities.indexOf("ALL") !== -1 ||
                (userRoles !== undefined &&
                    userRoles
                        .map(({ name }: any) => name)
                        .indexOf("Superuser") !== -1);

            const facilities: string[] = organisationUnits.map(
                (unit: any) => unit.id
            );
            const maxLevel =
                organisationUnitLevels.length > 0
                    ? organisationUnitLevels[0].value
                    : 1;
            const levels = organisationUnitLevels.map(
                ({ value }: any) => value
            );
            const minLevel: number | null | undefined = min(levels);
            const minSublevel: number | null | undefined = max(levels);

            const availableUnits = organisationUnits.map((unit: any) => {
                return {
                    id: unit.id,
                    pId: unit.pId || "",
                    value: unit.id,
                    title: unit.name,
                    key: unit.id,
                    isLeaf: unit.leaf,
                };
            });
            const settings = await getIndex<IDashboardSetting>(storage, {
                namespace: "i-dashboard-settings",
                systemId,
                otherQueries: [],
                signal,
                engine,
            });
            if (settings.length > 0) {
                storeApi.changeSelectedDashboard(settings[0].defaultDashboard);
                settingsApi.set(settings[0]);
            }
            if (minSublevel && minSublevel + 1 <= maxLevel) {
                storeApi.setMinSublevel(minSublevel + 1);
            } else {
                storeApi.setMinSublevel(maxLevel);
            }
            storeApi.setSystemId(systemId);
            storeApi.setSystemName(systemName);
            dataSetsApi.setDataSets(dataSets);
            storeApi.setInstanceBaseUrl(instanceBaseUrl);
            storeApi.setOrganisations(facilities);
            storeApi.setMaxLevel(maxLevel);
            storeApi.changeAdministration(isAdmin);
            storeApi;
            storeApi.setLevels([
                minLevel === 1 ? "3" : `${minLevel ? minLevel + 1 : 4}`,
            ]);
            await db.systemInfo.bulkPut([
                { id: "1", systemId, systemName, instanceBaseUrl },
            ]);
            await db.organisations.bulkPut(availableUnits);
            await db.levels.bulkPut(organisationUnitLevels);
            await db.groups.bulkPut(organisationUnitGroups);
            await db.dataSets.bulkPut(dataSets);
            return "Done";
        },
        { retry: false }
    );
};

export const useDataSources = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<IDataSource[], Error>(
        ["i-data-sources"],
        async ({ signal }) => {
            try {
                return await getIndex<IDataSource>(storage, {
                    namespace: "i-data-sources",
                    systemId,
                    otherQueries: [],
                    signal,
                    engine,
                });
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};
export const useDataSource = (
    storage: "data-store" | "es",
    id: string,
    action: "create" | "update" | "view" | undefined
) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>(
        ["i-data-sources", id, action],
        async ({ signal }) => {
            if (action === "update" || action === "view") {
                const dataSource = await getOneRecord<IDataSource>(
                    storage,
                    id,
                    {
                        namespace: "i-data-sources",
                        otherQueries: [],
                        signal,
                        engine,
                        systemId: "",
                    }
                );
                dataSourceApi.setDataSource(dataSource);
                return true;
            }
            const dataSource = createDataSource(id);
            dataSourceApi.setDataSource(dataSource);
            return true;
        }
    );
};

export const useDashboards = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<IDashboard[], Error>(
        ["i-dashboards"],
        async ({ signal }) => {
            try {
                const dashboards = await getIndex<IDashboard>(storage, {
                    namespace: "i-dashboards",
                    systemId,
                    otherQueries: [],
                    signal,
                    engine,
                });
                return dashboards;
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useDashboardTemplates = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<IDashboard[], Error>(
        ["i-dashboard-templates"],
        async ({ signal }) => {
            try {
                const dashboards = await getIndex<IDashboard>(storage, {
                    namespace: "i-dashboards",
                    systemId,
                    otherQueries: [],
                    signal,
                    engine,
                });
                return dashboards;
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useCategoryList = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<
        { dashboards: IDashboard[]; categories: ICategory[] },
        Error
    >(["i-dashboards-categories"], async ({ signal }) => {
        const dashboards = await getIndex<IDashboard>(storage, {
            namespace: "i-dashboards",
            systemId,
            otherQueries: [],
            signal,
            engine,
        });
        const categories = await getIndex<ICategory>(storage, {
            namespace: "i-categories",
            systemId,
            otherQueries: [],
            signal,
            engine,
        });

        return { dashboards, categories };
    });
};

export const useDashboard = (
    storage: "data-store" | "es",
    id: string,
    systemId: string,
    dashboardType: "dynamic" | "fixed",
    action: "view" | "create" | "update" | undefined
) => {
    const engine = useDataEngine();
    return useQuery<IDashboard, Error>(
        ["i-dashboards", id],
        async ({ signal }) => {
            if (action === "view" || action === "update") {
                let dashboard = await getOneRecord<IDashboard>(storage, id, {
                    namespace: "i-dashboards",
                    otherQueries: [],
                    signal,
                    engine,
                    systemId,
                });
                dashboardTypeApi.set(dashboard.type);
                dashboardApi.setCurrentDashboard(dashboard);
                storeApi.changeSelectedDashboard(dashboard.id);
                storeApi.changeSelectedCategory(dashboard.category || "");
                return dashboard;
            }
            dashboardTypeApi.set(dashboardType);
            const dashboard = createDashboard(id, dashboardType);
            dashboardApi.setCurrentDashboard(dashboard);
            return dashboard;
        }
    );
};

export const useDashboardTemplate = (
    storage: "data-store" | "es",
    id: string,
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<IDashboard, Error>(
        ["i-dashboard-template", id],
        async ({ signal }) => {
            let dashboard = await getOneRecord<IDashboard>(storage, id, {
                namespace: "i-dashboards",
                otherQueries: [],
                signal,
                engine,
                systemId,
            });
            return dashboard;
        }
    );
};

export const useCategories = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();

    return useQuery<ICategory[], Error>(
        ["i-categories"],
        async ({ signal }) => {
            try {
                return await getIndex(
                    storage,

                    {
                        namespace: "i-categories",
                        systemId,
                        otherQueries: [],
                        signal,
                        engine,
                    }
                );
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useCategory = (storage: "data-store" | "es", id: string) => {
    const engine = useDataEngine();

    return useQuery<boolean, Error>(
        ["i-categories", id],
        async ({ signal }) => {
            try {
                let category = await getOneRecord<ICategory>(storage, id, {
                    namespace: "i-categories",
                    otherQueries: [],
                    signal,
                    engine,
                    systemId: "",
                });
                if (!category) {
                    category = createCategory(id);
                }
                categoryApi.setCategory(category);
                return true;
            } catch (error) {
                console.error(error);
            }
            return true;
        }
    );
};

export const useNamespace = <TData>(
    namespace: string,
    storage: "data-store" | "es",
    systemId: string,
    key: string[],
    callback?: (value: TData[]) => void
) => {
    const engine = useDataEngine();
    return useQuery<TData[], Error>([namespace, ...key], async ({ signal }) => {
        try {
            const data = await getIndex<TData>(storage, {
                namespace,
                systemId,
                otherQueries: [],
                signal,
                engine,
            });
            if (callback) {
                callback(data);
            }
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    });
};

export const useVisualizationData = (
    storage: "data-store" | "es",
    systemId: string
) => {
    const engine = useDataEngine();
    return useQuery<IIndicator[], Error>(
        ["i-visualization-queries"],
        async ({ signal }) => {
            try {
                return await getIndex(storage, {
                    namespace: "i-visualization-queries",
                    systemId,
                    otherQueries: [],
                    signal,
                    engine,
                });
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useSingleNamespace = <TData>(
    storage: "data-store" | "es",
    id: string,
    systemId: string,
    namespace: string,
    action: "create" | "update" | "view" | undefined,
    onQuery: Event<TData>,
    onFailedData: TData
) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>(
        [namespace, id, action],
        async ({ signal }) => {
            if (action === "view" || action === "update") {
                const data = await getOneRecord<TData>(storage, id, {
                    namespace,
                    otherQueries: [],
                    signal,
                    engine,
                    systemId,
                });
                onQuery(data);
            } else {
                onQuery(onFailedData);
            }
            return true;
        }
    );
};

export const useDataSet = (dataSetId: string) => {
    const engine = useDataEngine();
    const namespaceQuery = {
        dataSet: {
            resource: `dataSets/${dataSetId}`,
            params: {
                fields: "categoryCombo[categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]]",
            },
        },
    };
    return useQuery<{ [key: string]: any }, Error>(
        ["data-set", dataSetId],
        async () => {
            try {
                const { dataSet }: any = await engine.query(namespaceQuery);
                // setAvailableCategories(categories);
                // setAvailableCategoryOptionCombos(categoryOptionCombos);
                // const selectedCategories = categories.map(
                //   ({ id, categoryOptions }: any, index: number) => [
                //     id,
                //     index === 0
                //       ? [categoryOptions[categoryOptions.length - 1]]
                //       : categoryOptions,
                //   ]
                // );
                // // setCategorization();
                // return fromPairs(selectedCategories);
                return {};
            } catch (error) {
                console.error(error);
                return {};
            }
        }
    );
};

export const getDHIS2Resources2 = async <T>({
    params,
    resource,
    engine,
}: Partial<{
    params: { [key: string]: string };
    resource: string;
    engine: any;
}>) => {
    const { data }: any = await engine.query({
        data: {
            resource,
            params,
        },
    });

    const x: {
        pager: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
        data: Array<T>;
    } = { pager: data.pager, data: data[resource ?? ""] };

    return x;
};

export const getDHIS2Resources = async <T>({
    isCurrentDHIS2,
    params,
    resource,
    resourceKey,
    api,
    engine,
}: Partial<{
    params: { [key: string]: string };
    resource: string;
    isCurrentDHIS2: boolean | undefined | null;
    resourceKey: string;
    api: AxiosInstance | undefined | null;
    engine: any;
}>) => {
    if (isCurrentDHIS2 && resource && resourceKey) {
        const { data }: any = await engine.query({
            data: {
                resource,
                params,
            },
        });

        const { pager } = data;
        let total = params?.pageSize || 10;

        if (pager && pager.total) {
            total = pager.total;
        }

        totalsApi.set(Number(total));

        return getOr<T[]>([], resourceKey, data);
    } else if (isCurrentDHIS2 && resource) {
        const { data }: any = await engine.query({
            data: {
                resource,
                params,
            },
        });
        return data as Array<T>;
    } else if (api && resource && resourceKey) {
        const { data } = await api.get<{ [key: string]: T[] }>(resource, {
            params,
            string: "",
        });
        return data[resourceKey];
    } else if (api && resource) {
        const { data } = await api.get<T[]>(resource, {
            params,
            string: "",
        });
        return data;
    }
    return [];
};

export const useDimensions = (
    isCurrentDHIS2: boolean | undefined | null,
    api: AxiosInstance | undefined | null
) => {
    const engine = useDataEngine();
    return useQuery<Array<INamed & { items: INamed[] }> | undefined, Error>(
        ["dimensions", isCurrentDHIS2],
        async () => {
            const data = getDHIS2Resources<INamed & { items: INamed[] }>({
                isCurrentDHIS2,
                resource: "dimensions.json",
                params: {
                    fields: "id,name,items[id,name]",
                    paging: "false",
                },
                api,
                engine,
                resourceKey: "dimensions",
            });
            return data;
        }
    );
};

export const useDHIS2Resources = ({
    page,
    pageSize,
    resource,
    q,
    isCurrentDHIS2,
    api,
    resourceKey,
    derive = true,
}: {
    page: number;
    pageSize: number;
    resource: string;
    q: string;
    isCurrentDHIS2: boolean | undefined | null;
    api: AxiosInstance | undefined | null;
    derive?: boolean;
    resourceKey?: string;
}) => {
    const engine = useDataEngine();
    let rKey = resourceKey;
    if (!rKey && derive) {
        rKey = resource.split(".")[0];
    }
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name,level",
        order: "name:ASC",
    };

    if (q) {
        params = {
            ...params,
            filter: `identifiable:token:${q}`,
        };
    }

    return useQuery<INamed[], Error>(
        [resource, page, pageSize, q, isCurrentDHIS2],
        async () => {
            const data = await getDHIS2Resources<INamed>({
                isCurrentDHIS2,
                resource,
                params,
                api,
                engine,
                resourceKey: rKey,
            });

            return data;
        }
    );
};

export const useSQLViews = (
    isCurrentDHIS2: boolean | undefined | null,
    api: AxiosInstance | undefined | null
) => {
    const params = {
        paging: "false",
        fields: "id,name,sqlQuery",
    };
    const engine = useDataEngine();
    return useQuery<Array<INamed & { sqlQuery: string }>, Error>(
        ["sql-views"],
        async () => {
            return getDHIS2Resources<INamed & { sqlQuery: string }>({
                isCurrentDHIS2,
                resource: "sqlViews.json",
                params,
                api,
                resourceKey: "sqlViews",
                engine,
            });
        }
    );
};

export const useDHIS2Visualizations = (
    isCurrentDHIS2: boolean | undefined | null,
    api: AxiosInstance | undefined | null,
    search: string | null | undefined
) => {
    const engine = useDataEngine();
    let params: {
        [key: string]: string;
    } = {
        fields: "id,name,type",
        pageSize: "10",
    };

    if (search) {
        params = { ...params, filter: `identifiable:token:${search}` };
    }
    return useQuery<Array<INamed & { type: string }>, Error>(
        ["dhis-visualizations", search],
        async () => {
            return getDHIS2Resources<INamed & { type: string }>({
                isCurrentDHIS2,
                resource: "visualizations.json",
                resourceKey: "visualizations",
                params,
                api,
                engine,
            });
        }
    );
};

export const useOrganisationUnitLevels = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    api: AxiosInstance | undefined | null
) => {
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,level,name",
    };
    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    return useQuery<Array<INamed & { level: number }>, Error>(
        ["organisation-unit-levels-1", page, pageSize],
        async () => {
            return getDHIS2Resources<INamed & { level: number }>({
                isCurrentDHIS2,
                resource: "filledOrganisationUnitLevels.json",
                params,
                api,
            });
        }
    );
};
const findDimension = (
    dimension: IDimension,
    globalFilters: { [key: string]: any } = {}
) => {
    return Object.entries(dimension).map(
        ([key, { resource, type, dimension, prefix }]) => {
            const globalValue = globalFilters[key];
            if (globalValue) {
                return {
                    resource,
                    type,
                    dimension,
                    value: globalValue
                        .map((a: any) => `${prefix || ""}${a}`)
                        .join(";"),
                };
            }
            return {
                resource,
                type,
                dimension,
                value: `${prefix || ""}${key}`,
            };
        }
    );
};

export const findLevelsAndOus = (indicator: IIndicator2 | undefined) => {
    if (indicator) {
        const denDimensions = indicator.denominator?.dataDimensions || {};
        const numDimensions = indicator.numerator?.dataDimensions || {};
        const denExpressions = indicator.denominator?.expressions || {};
        const numExpressions = indicator.numerator?.expressions || {};
        const ous = uniq([
            ...Object.entries(denDimensions)
                .filter(([_, { resource }]) => resource === "ou")
                .map(([key]) => key),
            ...Object.entries(numDimensions)
                .filter(([_, { resource }]) => resource === "ou")
                .map(([key]) => key),
            ...Object.entries(denExpressions)
                .filter(([key]) => key === "ou")
                .map(([_, value]) => value.value),
            ...Object.entries(numExpressions)
                .filter(([key]) => key === "ou")
                .map(([_, value]) => value.value),
        ]);
        const levels = uniq([
            ...Object.entries(denDimensions)
                .filter(([_, { resource }]) => resource === "oul")
                .map(([key]) => key),
            ...Object.entries(numDimensions)
                .filter(([_, { resource }]) => resource === "oul")
                .map(([key]) => key),
            ...Object.entries(denExpressions)
                .filter(([key]) => key === "oul")
                .map(([_, value]) => value.value),
            ...Object.entries(numExpressions)
                .filter(([key]) => key === "oul")
                .map(([_, value]) => value.value),
        ]);
        return { levels, ous };
    }
    return { levels: [], ous: [] };
};

const makeDHIS2Query = (
    data: IData2,
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: any } = {}
) => {
    const filtered = fromPairs(
        Object.entries(data.dataDimensions).filter(
            ([id, dimension]) => dimension.type && dimension.dimension
        )
    );
    const allDimensions = findDimension(filtered, globalFilters);

    const final = Object.entries(
        groupBy(allDimensions, (v) => `${v.type}${v.dimension}`)
    )
        .flatMap(([x, y]) => {
            const first = y[0];
            const finalValues = y.map(({ value }) => value).join(";");
            if (y) {
                if (first.dimension === "") {
                    return y.map(({ value }) => `${first.type}=${value}`);
                }
                return [`${first.type}=${first.dimension}:${finalValues}`];
            }
            return [];
        })
        .join("&");
    return final;
};

const makeSQLViewsQueries = (
    expressions: IExpressions = {},
    globalFilters: { [key: string]: any } = {},
    otherParameters: { [key: string]: any }
) => {
    let initial = otherParameters;
    Object.entries(expressions).forEach(([col, val]) => {
        if (val.isGlobal && globalFilters[val.value]) {
            initial = {
                ...initial,
                [`var=${col}`]: globalFilters[val.value].join("-"),
            };
        } else if (!val.isGlobal && val.value) {
            const keys = Object.keys(globalFilters).some(
                (e) => String(val.value).indexOf(e) !== -1
            );
            if (keys) {
                Object.entries(globalFilters).forEach(
                    ([globalId, globalValue]) => {
                        if (String(val.value).indexOf(globalId) !== -1) {
                            let currentValue = String(val.value).replaceAll(
                                globalId,
                                globalValue.join("-")
                            );
                            const calcIndex = currentValue.indexOf("calc");
                            if (calcIndex !== -1) {
                                const original = currentValue.slice(calcIndex);
                                const computed = evaluate(
                                    original.replaceAll("calc", "")
                                );
                                currentValue = currentValue.replaceAll(
                                    original,
                                    computed
                                );
                            }
                            initial = {
                                ...initial,
                                [`var=${col}`]: currentValue,
                            };
                        }
                    }
                );
            } else {
                initial = { ...initial, [`var=${col}`]: val.value };
            }
        }
    });
    return Object.entries(initial)
        .map(([key, value]) => `${key}:${value}`)
        .join("&");
};

const generateKeys = (
    indicators: IIndicator2[] = [],
    globalFilters: { [key: string]: any } = {}
) => {
    const all = indicators.flatMap((indicator) => {
        const numKeys = Object.keys(indicator?.numerator?.dataDimensions || {});
        const denKeys = Object.keys(
            indicator?.denominator?.dataDimensions || {}
        );
        const numExpressions = Object.entries(
            indicator?.numerator?.expressions || {}
        ).map(([e, value]) => {
            return value.value;
        });
        const denExpressions = Object.entries(
            indicator?.denominator?.expressions || {}
        ).map(([e, value]) => {
            return value.value;
        });
        return uniq([
            ...numKeys,
            ...denKeys,
            ...numExpressions,
            ...denExpressions,
        ]).flatMap((id) => {
            return globalFilters[id] || [id];
        });
    });
    return uniq(all);
};

const processDHIS2Data = (
    data: any[],
    options: Partial<{
        fromColumn: string;
        toColumn: string;
        flatteningOption: string;
        joinData: any[];
        otherFilters: { [key: string]: any };
        fromFirst: boolean;
    }>
) => {
    if (options.joinData && options.fromColumn && options.toColumn) {
        data = merge2DataSources(
            data,
            options.joinData,
            options.fromColumn,
            options.toColumn,
            options.fromFirst || false
        );
    }
    if (!isEmpty(options.otherFilters) && isArray(data)) {
        const processedData = data.filter((data: any) => {
            const values = Object.entries(options.otherFilters || {}).map(
                ([key, value]) => data[key] === String(value).padStart(2, "0")
            );
            return every(values);
        });
        return processedData;
    }

    return data;
};

const getDHIS2Query = (
    query: IData2,
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: string } = {}
) => {
    if (query.type === "ANALYTICS") {
        let params = makeDHIS2Query(query, globalFilters, overrides);
        if (query.aggregationType) {
            params = `${params}&aggregationType=${query.aggregationType}`;
        }
        return `analytics.json?${params}`;
    }
    if (query.type === "SQL_VIEW") {
        let currentParams = "";
        const allParams = fromPairs(
            getSearchParams(query.query).map((re) => [`var=${re}`, "NULL"])
        );
        const params = makeSQLViewsQueries(
            query.expressions,
            globalFilters,
            allParams
        );
        if (params) {
            currentParams = `?${params}&paging=false`;
        }
        return `sqlViews/${
            Object.keys(query.dataDimensions)[0]
        }/data.json${currentParams}`;
    }

    if (query.type === "API") {
        return query.query;
    }
};

const queryData = async (
    engine: any,
    vq: IData2 | undefined,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    console.log(vq);
    const realData = await queryDHIS2(engine, vq, globalFilters);
    const joinData = await queryDHIS2(engine, vq?.joinTo, globalFilters);
    let dimensions: { [key: string]: string[] } = {};
    let metadata: { [key: string]: string } = {};

    const data = processDHIS2Data(
        flattenDHIS2Data(realData, {
            flatteningOption: vq?.flatteningOption,
            includeEmpty: vq?.includeEmpty,
            valueIfEmpty: vq?.valueIfEmpty,
        }),
        {
            flatteningOption: vq?.flatteningOption,
            joinData: flattenDHIS2Data(joinData, {
                flatteningOption: vq?.joinTo?.flatteningOption,
                includeEmpty: vq?.joinTo?.includeEmpty,
                valueIfEmpty: vq?.joinTo?.valueIfEmpty,
            }),
            otherFilters,
            fromColumn: vq?.fromColumn,
            toColumn: vq?.toColumn,
            fromFirst: vq?.fromFirst,
        }
    );

    if (vq?.dataSource?.type === "DHIS2" && vq.type === "ANALYTICS") {
        dimensions = realData.metaData.dimensions;
        metadata = fromPairs(
            Object.entries(realData.metaData.items).map(
                ([item, { name }]: [string, any]) => [item, name]
            )
        );
        if (
            vq.joinTo &&
            vq.joinTo.dataSource?.type === "DHIS2" &&
            vq.joinTo.type === "ANALYTICS"
        ) {
            const others = fromPairs(
                Object.entries(joinData.metaData.items).map(
                    ([item, { name }]: [string, any]) => [item, name]
                )
            );
            metadata = { ...metadata, ...others };
            Object.entries(joinData.metaData.dimensions).forEach(
                ([key, values]) => {
                    if (dimensions[key]) {
                        dimensions = {
                            ...dimensions,
                            [key]: uniq([
                                ...dimensions[key],
                                ...(values as string[]),
                            ]),
                        };
                    } else {
                        dimensions = {
                            ...dimensions,
                            [key]: values as string[],
                        };
                    }
                }
            );
        }
    } else {
        const allKeys = uniq(flatten(flatten(data).map((d) => Object.keys(d))));
        allKeys.forEach((key) => {
            dimensions = {
                ...dimensions,
                [key]: uniq(data.map((d) => d[key])),
            };
        });
    }

    return { data, dimensions, metadata };
};

const queryDHIS2 = async (
    engine: any,
    vq: IData2 | undefined,
    globalFilters: { [key: string]: any } = {}
) => {
    if (vq) {
        if (vq.dataSource && vq.dataSource.type === "DHIS2") {
            const query = getDHIS2Query(vq, globalFilters);
            if (vq.dataSource.isCurrentDHIS2) {
                const { data } = await engine.query({
                    data: {
                        resource: query,
                    },
                });
                return data;
            }
            const { data } = await axios.get(
                `${vq.dataSource.authentication.url}/api/${query}`,
                {
                    auth: {
                        username: vq.dataSource.authentication.username,
                        password: vq.dataSource.authentication.password,
                    },
                    string: "",
                }
            );
            return data;
        }

        if (vq.dataSource && vq.dataSource.type === "API") {
            const { data } = await axios.get(vq.dataSource.authentication.url, {
                auth: {
                    username: vq.dataSource.authentication.username,
                    password: vq.dataSource.authentication.password,
                },
                string: "",
            });
            return data;
        }

        if (vq.dataSource && vq.dataSource.type === "INDEX_DB") {
            return await db.events.toArray();
        }
        if (
            vq.dataSource &&
            vq.dataSource.type === "ELASTICSEARCH" &&
            vq.query
        ) {
            const { data } = await axios.post(
                vq.dataSource.authentication.url,
                JSON.parse(
                    vq.query
                        .replaceAll("${ou}", globalFilters["mclvD0Z9mfT"])
                        .replaceAll("${pe}", globalFilters["m5D13FqKZwN"])
                        .replaceAll("${le}", globalFilters["GQhi6pRnTKF"])
                        .replaceAll("${gp}", globalFilters["of2WvtwqbHR"])
                ),
                {
                    auth: {
                        username: vq.dataSource.authentication.username,
                        password: vq.dataSource.authentication.password,
                    },
                    string: "",
                }
            );
            return data;
        }
    }
    return undefined;
};

const computeIndicator = (
    indicator: IIndicator2,
    currentValue: any,
    numeratorValue: string,
    denominatorValue: string
) => {
    if (indicator.custom && numeratorValue && denominatorValue) {
        const expression = indicator.factor
            .replaceAll("x", numeratorValue)
            .replaceAll("y", denominatorValue);
        return {
            ...currentValue,
            value: evaluate(expression),
        };
    }

    if (numeratorValue && denominatorValue && indicator.factor !== "1") {
        const computed = Number(numeratorValue) / Number(denominatorValue);
        return {
            ...currentValue,
            value: evaluate(`${computed}${indicator.factor}`),
        };
    }

    if (numeratorValue && denominatorValue) {
        const computed = Number(numeratorValue) / Number(denominatorValue);
        return {
            ...currentValue,
            value: computed,
        };
    }
    return { ...currentValue, value: 0 };
};

const queryIndicator = async (
    engine: any,
    indicator: IIndicator2,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    const {
        data: numerator,
        dimensions,
        metadata,
    } = await queryData(
        engine,
        indicator.numerator,
        globalFilters,
        otherFilters
    );
    const { data: denominator } = await queryData(
        engine,
        indicator.denominator,
        globalFilters,
        otherFilters
    );

    if (numerator && denominator) {
        const data = numerator.map(
            (currentValue: { [key: string]: string }) => {
                const { value: v1, total: t1, ...others } = currentValue;
                const columns = Object.values(others).sort().join("");

                const denominatorSearch = denominator.find(
                    (row: { [key: string]: string }) => {
                        const { value, total, ...someOthers } = row;
                        return (
                            columns ===
                            Object.values(someOthers).sort().join("")
                        );
                    }
                );
                if (denominatorSearch) {
                    const { value: v1, total: t1 } = currentValue;
                    const { value: v2, total: t2 } = denominatorSearch;

                    const numeratorValue = v1 || t1;
                    const denominatorValue = v2 || t2;

                    return computeIndicator(
                        indicator,
                        currentValue,
                        numeratorValue,
                        denominatorValue
                    );
                }
                return { ...currentValue, value: 0 };
            }
        );
        return { data, dimensions };
    }
    return { data: numerator, dimensions, metadata };
};

const processVisualization = async (
    engine: any,
    visualization: IVisualization2,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    const data = await Promise.all(
        visualization.indicators.map((indicator) =>
            queryIndicator(engine, indicator, globalFilters, otherFilters)
        )
    );

    const actualData = data.flatMap(({ data }) => data);
    let finalDimensions: { [key: string]: string[] } = {};
    let finalMetadata: { [key: string]: string } = {};
    data.forEach(({ dimensions, metadata }) => {
        Object.entries(dimensions).forEach(([key, values]) => {
            finalDimensions = {
                ...finalDimensions,
                [key]: [...values, ...(finalDimensions[key] || [])],
            };
        });
        finalMetadata = { ...finalMetadata, ...metadata };
    });

    visualizationDimensionsApi.updateVisualizationData({
        visualizationId: visualization.id,
        data: finalDimensions,
    });
    visualizationDataApi.updateVisualizationData({
        visualizationId: visualization.id,
        data: actualData,
    });
    visualizationMetadataApi.updateVisualizationMetadata({
        visualizationId: visualization.id,
        data: finalMetadata,
    });
    return actualData;
};

export const useVisualizationMetadata = (
    visualization: IVisualization,
    storage: Storage
) => {
    const engine = useDataEngine();
    return useQuery<IVisualization2, Error>(
        [
            "visualizations-metadata",
            visualization.id,
            ...visualization.indicators,
        ],
        async ({ signal }) => {
            const indicators = await Promise.all(
                visualization.indicators.map((id) =>
                    getOneRecord<IIndicator>(storage, id, {
                        namespace: "i-indicators",
                        otherQueries: [],
                        signal,
                        engine,
                        systemId: "",
                    })
                )
            );

            let queries = await Promise.all(
                indicators
                    .flatMap(({ numerator, denominator }) => {
                        if (numerator && denominator) {
                            return [numerator, denominator];
                        } else if (numerator) {
                            return numerator;
                        }
                        return "";
                    })
                    .filter((x) => x !== "")
                    .map((id) =>
                        getOneRecord<IData>(storage, id, {
                            namespace: "i-visualization-queries",
                            otherQueries: [],
                            signal,
                            engine,
                            systemId: "",
                        })
                    )
            );
            const joiners = await Promise.all(
                queries.flatMap(({ joinTo }) => {
                    if (joinTo) {
                        return getOneRecord<IData>(storage, joinTo, {
                            namespace: "i-visualization-queries",
                            otherQueries: [],
                            signal,
                            engine,
                            systemId: "",
                        });
                    }
                    return [];
                })
            );
            queries = [...queries, ...joiners];

            const dataSources = await Promise.all(
                queries
                    .map(({ dataSource }) => {
                        if (dataSource) {
                            return dataSource;
                        }
                        return "";
                    })
                    .filter((x) => x !== "")
                    .map((id) =>
                        getOneRecord<IDataSource>(storage, id, {
                            namespace: "i-data-sources",
                            otherQueries: [],
                            signal,
                            engine,
                            systemId: "",
                        })
                    )
            );

            const processedIndicators: Array<IIndicator2> = indicators.map(
                (i) => {
                    let numerator1 = queries.find((q) => q.id === i.numerator);
                    let denominator1 = queries.find(
                        (q) => q.id === i.denominator
                    );
                    let numerator: IData2 | undefined = undefined;
                    let denominator: IData2 | undefined = undefined;

                    if (numerator1) {
                        let joiner = queries.find(
                            (q) => q.id === numerator1?.joinTo
                        );
                        let joinTo: IData2 | undefined = undefined;

                        if (joiner) {
                            joinTo = {
                                id: joiner.id,
                                name: joiner.name,
                                description: joiner.description,
                                type: joiner.type,
                                accessor: joiner.accessor,
                                expressions: joiner.expressions,
                                fromFirst: joiner.fromFirst,
                                flatteningOption: joiner.flatteningOption,
                                fromColumn: joiner.fromColumn,
                                toColumn: joiner.toColumn,
                                query: joiner.query,
                                dataDimensions: joiner.dataDimensions,
                                aggregationType: joiner.aggregationType,
                                valueIfEmpty: joiner.valueIfEmpty,
                                includeEmpty: joiner.includeEmpty,
                                dataSource: dataSources.find(
                                    (ds) => ds.id === joiner?.dataSource
                                ),
                            };
                        }
                        numerator = {
                            id: numerator1.id,
                            name: numerator1.name,
                            description: numerator1.description,
                            type: numerator1.type,
                            accessor: numerator1.accessor,
                            expressions: numerator1.expressions,
                            fromFirst: numerator1.fromFirst,
                            flatteningOption: numerator1.flatteningOption,
                            fromColumn: numerator1.fromColumn,
                            toColumn: numerator1.toColumn,
                            query: numerator1.query,
                            dataDimensions: numerator1.dataDimensions,
                            aggregationType: numerator1.aggregationType,
                            valueIfEmpty: numerator1.valueIfEmpty,
                            includeEmpty: numerator1.includeEmpty,
                            dataSource: dataSources.find(
                                (ds) => ds.id === numerator1?.dataSource
                            ),
                            joinTo,
                        };
                    }

                    if (denominator1) {
                        let joiner = queries.find(
                            (q) => q.id === denominator1?.joinTo
                        );
                        let joinTo: IData2 | undefined = undefined;

                        if (joiner) {
                            joinTo = {
                                id: joiner.id,
                                name: joiner.name,
                                description: joiner.description,
                                type: joiner.type,
                                accessor: joiner.accessor,
                                expressions: joiner.expressions,
                                fromFirst: joiner.fromFirst,
                                flatteningOption: joiner.flatteningOption,
                                fromColumn: joiner.fromColumn,
                                toColumn: joiner.toColumn,
                                query: joiner.query,
                                dataDimensions: joiner.dataDimensions,
                                aggregationType: joiner.aggregationType,
                                dataSource: dataSources.find(
                                    (ds) => ds.id === joiner?.dataSource
                                ),
                            };
                        }
                        denominator = {
                            id: denominator1.id,
                            name: denominator1.name,
                            description: denominator1.description,
                            type: denominator1.type,
                            accessor: denominator1.accessor,
                            expressions: denominator1.expressions,
                            fromFirst: denominator1.fromFirst,
                            flatteningOption: denominator1.flatteningOption,
                            fromColumn: denominator1.fromColumn,
                            toColumn: denominator1.toColumn,
                            query: denominator1.query,
                            dataDimensions: denominator1.dataDimensions,
                            aggregationType: denominator1.aggregationType,
                            dataSource: dataSources.find(
                                (ds) => ds.id === denominator1?.dataSource
                            ),
                            joinTo,
                        };
                    }
                    return {
                        id: i.id,
                        name: i.name,
                        description: i.description,
                        query: i.query,
                        custom: i.custom,
                        factor: i.factor,
                        numerator,
                        denominator,
                    };
                }
            );

            const realVisualization: IVisualization2 = {
                ...visualization,
                indicators: processedIndicators,
            };
            return realVisualization;
        }
    );
};

export const useVisualization = (
    visualization: IVisualization2,
    refreshInterval?: string,
    globalFilters?: { [key: string]: any },
    otherFilters?: { [key: string]: any }
) => {
    const engine = useDataEngine();
    let currentInterval: boolean | number = false;
    if (refreshInterval && refreshInterval !== "off") {
        currentInterval = Number(refreshInterval) * 1000;
    }
    const otherKeys = generateKeys(visualization.indicators, globalFilters);
    const overrides = visualization.overrides || {};

    return useQuery<any, Error>(
        [
            "visualizations",
            ...visualization.indicators,
            ...otherKeys,
            ...Object.values(overrides),
            ...Object.values(otherFilters || {}),
        ],
        async ({ signal }) => {
            return processVisualization(
                engine,
                visualization,
                globalFilters,
                otherFilters
            );
        },
        {
            refetchInterval: currentInterval,
            refetchIntervalInBackground: true,
            refetchOnWindowFocus: true,
        }
    );
};

export const useMaps = (
    levels: string[],
    parents: string[],
    data: any[],
    thresholds: Threshold[],
    otherKeys: string[]
) => {
    const engine = useDataEngine();
    const parent = parents
        .map((p) => {
            return `parent=${p}`;
        })
        .join("&");
    const level = levels
        .map((l) => {
            return `level=${l}`;
        })
        .join("&");

    let resource = `organisationUnits.geojson?${parent}`;
    if (level) {
        resource = `organisationUnits.geojson?${parent}&${level}`;
    }
    let query = {
        geojson: {
            resource,
        },
    };

    const levelsQuery = levels.map((l) => [
        `level${l}`,
        {
            resource: "organisationUnits.json",
            params: {
                level: l,
                fields: "id,name",
                paging: false,
            },
        },
    ]);

    query = { ...query, ...fromPairs(levelsQuery) };
    return useQuery<any, Error>(
        ["maps", ...levels, ...parents, ...otherKeys],
        async () => {
            const { geojson, ...otherLevels }: any = await engine.query(query);
            return processMap(geojson, otherLevels, data, thresholds);
        },
        { refetchInterval: 5000 }
    );
};

export const saveDocument = async <TData extends INamed>(
    storage: Storage,
    index: string,
    systemId: string,
    document: Partial<TData>,
    engine: any,
    type: "create" | "update" | "view"
) => {
    if (storage === "es") {
        const { data } = await api.post(`wal/index?index=${index}`, {
            ...document,
            systemId,
        });
        return data;
    }
    if (document) {
        const mutation: any = {
            type,
            resource: `dataStore/${index}/${document.id}`,
            data: document,
        };
        return engine.mutate(mutation);
    }
};

export const deleteDocument = async (
    storage: Storage,
    index: string,
    id: string,
    engine: any
) => {
    if (storage === "es") {
        const { data } = await api.post(`wal/delete?index=${index}&id=${id}`);
        return data;
    }
    const mutation: any = {
        type: "delete",
        resource: `dataStore/${index}/${id}`,
    };
    return engine.mutate(mutation);
};

export const useOptionSet = (optionSetId: string) => {
    const engine = useDataEngine();
    const query = {
        optionSet: {
            resource: `optionSets/${optionSetId}.json`,
            params: {
                fields: "options[name,code]",
            },
        },
    };

    return useQuery<{ code: string; name: string }[], Error>(
        ["optionSet", optionSetId],
        async () => {
            if (optionSetId) {
                const {
                    optionSet: { options },
                }: any = await engine.query(query);
                return options;
            }
            return [];
        }
    );
};

export const useTheme = (optionSetId: string) => {
    const engine = useDataEngine();
    const query = {
        optionSet: {
            resource: `optionSets/${optionSetId}.json`,
            params: {
                fields: "options[name,code]",
            },
        },
    };

    return useQuery<boolean, Error>(["optionSet", optionSetId], async () => {
        const themes = await db.themes.toArray();
        if (themes.length === 0) {
            const {
                optionSet: { options },
            }: any = await engine.query(query);
            await db.themes.bulkAdd(
                options.map(({ code, name }: any) => {
                    return {
                        title: name,
                        key: code,
                        id: code,
                        pId: "",
                        value: code,
                    };
                })
            );
        }
        return true;
    });
};

export const useFilterResources = (dashboards: IDashboard[]) => {
    let parents: DataNode[] = dashboards.map((dashboard) => {
        return {
            pId: "",
            nodeSource: {},
            key: dashboard.id,
            value: dashboard.id,
            title: dashboard.name,
            id: dashboard.id,
            checkable: false,
            isLeaf: dashboard.filters ? dashboard.filters.length === 0 : true,
        };
    });
    const engine = useDataEngine();
    return useQuery<DataNode[], Error>(
        ["filters", dashboards.map(({ id }) => id).join() || ""],
        async () => {
            for (const dashboard of dashboards) {
                if (dashboard.filters) {
                    const queries = fromPairs(
                        dashboard.filters.map(({ id, resource }) => [
                            id,
                            {
                                resource,
                            },
                        ])
                    );
                    const response: any = await engine.query(queries);
                    const children = dashboard.filters.flatMap(
                        ({ id, resourceKey }) => {
                            const data = response[id];
                            if (data && data.options) {
                                return data.options.map(
                                    ({ code, id, name }: any) => {
                                        const node: DataNode = {
                                            pId: dashboard.id,
                                            nodeSource: { search: resourceKey },
                                            key: id,
                                            value: code,
                                            title: name,
                                            id,
                                            isLeaf: true,
                                            checkable: false,
                                            hasChildren: false,
                                            selectable: true,
                                            actual: dashboard.child,
                                        };
                                        return node;
                                    }
                                );
                            } else if (data && data.dataElementGroups) {
                                return data.dataElementGroups.map(
                                    ({ code, id, name }: any) => {
                                        const node: DataNode = {
                                            pId: dashboard.id,
                                            nodeSource: { search: resourceKey },
                                            key: id,
                                            value: code,
                                            title: name,
                                            id,
                                            isLeaf: true,
                                            // checkable: true,
                                            hasChildren: false,
                                            selectable: true,
                                            actual: dashboard.child,
                                        };
                                        return node;
                                    }
                                );
                            }
                            return [];
                        }
                    );
                    parents = [...parents, ...children];
                }
            }

            return parents;
        }
    );
};

export const useGlobal = (global: { [key: string]: any[] }) => {
    const engine = useDataEngine();
};

export const useDHIS2Visualization = (viz: IVisualization) => {
    const engine = useDataEngine();
    return useQuery<
        { data: any; visualization: IVisualization; metadata: any[] },
        Error
    >(
        ["dhis2-visualization", viz.id, viz.properties["visualization"]],
        async () => {
            if (viz.properties?.["visualization"]) {
                const query = {
                    visualization: {
                        resource: `visualizations/${viz.properties["visualization"]}.json`,
                        params: {
                            fields: "aggregationType,axes,colSubTotals,colTotals,colorSet,columns[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],completedOnly,created,cumulative,cumulativeValues,description,digitGroupSeparator,displayDensity,displayDescription,displayName,displayShortName,favorite,favorites,filters[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],fixColumnHeaders,fixRowHeaders,fontSize,fontStyle,hideEmptyColumns,hideEmptyRowItems,hideEmptyRows,hideSubtitle,hideTitle,href,id,interpretations[id,created],lastUpdated,lastUpdatedBy,legend[showKey,style,strategy,set[id,name,displayName,displayShortName,legends[endValue,color,startValue,id]]],measureCriteria,name,noSpaceBetweenColumns,numberType,outlierAnalysis,parentGraphMap,percentStackedValues,publicAccess,regression,regressionType,reportingParams,rowSubTotals,rowTotals,rows[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],series,seriesKey,shortName,showData,showDimensionLabels,showHierarchy,skipRounding,sortOrder,subscribed,subscribers,subtitle,timeField,title,topLimit,translations,type,user[name,displayName,displayShortName,userCredentials[username]],userAccesses,userGroupAccesses,yearlySeries,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!code,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!externalAccess,!filterDimensions,!itemOrganisationUnitGroups,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!periods,!programIndicatorDimensions,!relativePeriods,!rowDimensions,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren",
                        },
                    },
                };

                const { visualization }: any = await engine.query(query);
                const params = getAnalyticsQuery(visualization);
                const availableColors =
                    visualization.legend?.set?.legends || [];

                const thresholds: Threshold[] = availableColors.map(
                    ({ id, startValue, color }: any) => ({
                        id,
                        value: startValue,
                        color,
                    })
                );
                const {
                    data: { headers, rows, metaData },
                }: any = await engine.query({
                    data: { resource: `analytics.json?${params}` },
                });

                const currentVisualization: IVisualization = {
                    ...viz,
                    name: visualization.name,
                    properties: {
                        ...viz.properties,
                        ...findParameters(visualization),
                        ["data.thresholds"]: thresholds,
                    },
                };
                const data = processAnalyticsData({
                    headers,
                    rows,
                    metaData,
                    options: { includeEmpty: true, valueIfEmpty: "" },
                });
                sectionApi.setVisualization(currentVisualization);
                visualizationDataApi.updateVisualizationData({
                    visualizationId: currentVisualization.id,
                    data,
                });
                return {
                    visualization: currentVisualization,
                    metadata: visualization,
                    data,
                };
            }
            return {
                visualization: viz,
                metadata: {},
                data: [],
            };
        }
    );
};
