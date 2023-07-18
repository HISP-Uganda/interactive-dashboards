import { useDataEngine } from "@dhis2/app-runtime";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Event } from "effector";
import {
    fromPairs,
    groupBy,
    isEmpty,
    min,
    uniq,
    flatten,
    every,
    uniqBy,
    max,
} from "lodash";
import { evaluate } from "mathjs";
import { db } from "./db";
import {
    categoriesApi,
    categoryApi,
    dashboardApi,
    dashboardTypeApi,
    dataSetsApi,
    dataSourceApi,
    dataSourcesApi,
    indicatorsApi,
    paginationApi,
    settingsApi,
    storeApi,
    visualizationDataApi,
    calculatedApi,
} from "./Events";
import {
    DataNode,
    ICategory,
    IDashboard,
    IDashboardSetting,
    IData,
    IDataSource,
    IDimension,
    IExpressions,
    IIndicator,
    INamed,
    IVisualization,
    Storage,
    Threshold,
    IFilter,
} from "./interfaces";
import { createCategory, createDashboard, createDataSource } from "./Store";
import {
    getSearchParams,
    processMap,
    flattenDHIS2Data,
    merge2DataSources,
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
            },
            { signal: args.signal }
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
    args: Pick<QueryProps, "namespace" | "engine">,
    isNotNew: boolean
) => {
    if (isNotNew) {
        const { namespace, engine } = args;
        const namespaceQuery = {
            storedValue: {
                resource: `dataStore/${namespace}/${id}`,
            },
        };
        try {
            const { storedValue } = await engine.query(namespaceQuery);
            return storedValue as TData;
        } catch (error) {
            console.log(error);
        }
    }
};

export const getESRecord = async <TData>(
    id: string,
    args: Omit<QueryProps, "systemId" | "engine">
) => {
    try {
        let {
            data: {
                body: { _source },
            },
        } = await api.post<{ body: { _source: TData } }>(
            "wal/get",
            {
                index: args.namespace,
                id,
            },
            { signal: args.signal }
        );
        return _source;
    } catch (error) {
        return null;
    }
};

export const getOneRecord = async <TData>(
    storage: "data-store" | "es",
    id: string,
    args: QueryProps,
    isNotNew: boolean = true
) => {
    if (storage === "es") {
        return getESRecord<TData>(id, args);
    }
    return getDHIS2Record<TData>(id, args, isNotNew);
};

export const useInitials = (storage: "data-store" | "es") => {
    const engine = useDataEngine();
    const ouQuery = {
        me: {
            resource: "me.json",
            params: {
                fields: "organisationUnits[id,name,leaf,level],authorities",
            },
        },
        levels: {
            resource: "organisationUnitLevels.json",
            params: {
                order: "level:DESC",
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
        // directives: {
        //     resource:
        //         "analytics.json?dimension=dx:B04qyv8sHLZ;Et0jLLFoPiQ;FJ1pjZ5Edzf;HolY9bB9ndg;I8NkRKchMoU;N7r57cuvssW;PQxdLS3vke3;Q18G7d3DPOg;QYISgIjXTJC;QgvBHBb5xcS;UEDzAaR5GpB;WdilrXx08R4;gjqIp8H7948;gypjprrtiKV;h4lJWKnqnxx;lYoAOhykYUW;m3xNIoQ2esR;nOnQwK1sDaN;tWRpQ8HFWk4;um8prFWwCYU;w6VmDxFste0;wRshJ7SJcHq;wXeABLEj9Vj&dimension=pe:2020July;2021July;2022July;2023July;2024July&dimension=ou:qjk1ujdzlss&aggregationType=MAX",
        // },
    };
    return useQuery<string, Error>(
        ["initialing"],
        async ({ signal }) => {
            const {
                //directives: { rows, headers },
                systemInfo: { systemId, systemName, instanceBaseUrl },
                me: { organisationUnits, authorities },
                levels: { organisationUnitLevels },
                groups: { organisationUnitGroups },
                dataSets: { dataSets },
            }: any = await engine.query(ouQuery);

            // const processed = flattenDHIS2Data(
            //     rows.map((row: string[]) => {
            //         return fromPairs(
            //             row.map((value, index) => {
            //                 const header = headers?.[index];
            //                 return [header.name, value];
            //             })
            //         );
            //     }),
            //     "processDirectives"
            // );

            //const maxPe = max(processed.map((d: any) => d.pe));

            // Object.entries(
            //     groupBy(
            //         processed.filter((d: any) => d.pe === maxPe),
            //         "label"
            //     )
            // ).forEach(([id, values]) =>
            //     calculatedApi.add({
            //         id,
            //         value: uniqBy(values, "dx").length,
            //     })
            // );

            const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;
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
            // const defaultDashboard = settings.find(
            //     (s: any) => s.id === systemId && s.default
            // );
            if (settings.length > 0) {
                storeApi.changeSelectedDashboard(settings[0].defaultDashboard);
                storeApi.setDefaultDashboard(settings[0].defaultDashboard);
                // if (defaultDashboard.storage) {
                //     settingsApi.changeStorage(defaultDashboard.storage);
                // }
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
                storeApi.setCurrentPage("data-sources");
                storeApi.setShowFooter(false);
                storeApi.setShowSider(true);
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
export const useDataSource = (storage: "data-store" | "es", id: string) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>(
        ["i-data-sources", id],
        async ({ signal }) => {
            let dataSource = await getOneRecord<IDataSource>(storage, id, {
                namespace: "i-data-sources",
                otherQueries: [],
                signal,
                engine,
                systemId: "",
            });
            if (isEmpty(dataSource)) {
                dataSource = createDataSource(id);
            }
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
                const processed = dashboards.map((d) => {
                    const node: DataNode = {
                        isLeaf: d.filters ? d.filters.length > 0 : false,
                        id: d.id,
                        pId: "",
                        key: d.id,
                        style: { fontWeight: "bold" },
                        title: d.name || "",
                        checkable: false,
                        nodeSource: d.nodeSource,
                        hasChildren: d.hasChildren,
                    };
                    return node;
                });
                db.dashboards.bulkPut(processed);
                return dashboards;
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useDashboard = (
    storage: "data-store" | "es",
    id: string,
    systemId: string,
    dashboardType: "dynamic" | "fixed",
    refresh: boolean = true
) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>(
        ["i-dashboards", id],
        async ({ signal }) => {
            if (refresh) {
                let dashboard = await getOneRecord<IDashboard>(storage, id, {
                    namespace: "i-dashboards",
                    otherQueries: [],
                    signal,
                    engine,
                    systemId,
                });
                if (isEmpty(dashboard)) {
                    dashboard = createDashboard(id, dashboardType);
                } else if (dashboard.targetCategoryCombo) {
                    const {
                        combo: { categoryOptionCombos },
                    }: any = await engine.query({
                        combo: {
                            resource: `categoryCombos/${dashboard.targetCategoryCombo}`,
                            params: {
                                fields: "categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]",
                            },
                        },
                    });
                    dashboardApi.setTargetCategoryOptionCombos(
                        categoryOptionCombos
                    );
                }
                dashboardTypeApi.set(dashboard.type);
                const queries = await getIndex<IIndicator>(storage, {
                    namespace: "i-visualization-queries",
                    systemId,
                    otherQueries: [],
                    signal,
                    engine,
                });
                // const processedDirectives = dataElementGroups.flatMap(
                //     ({
                //         code: degCode,
                //         name: degName,
                //         dataElements,
                //         id: degId,
                //         attributeValues,
                //     }: any) => {
                //         return dataElements.map(
                //             ({
                //                 id,
                //                 name,
                //                 code,
                //                 attributeValues: deav,
                //             }: any) => {
                //                 let programCode = "";
                //                 const attribute = attributeValues.find(
                //                     ({ attribute }: any) =>
                //                         attribute.id === "UBWSASWdyfi"
                //                 );
                //                 if (attribute) {
                //                     programCode = attribute.value;
                //                 }

                //                 const decreasing = deav.find(
                //                     ({ attribute }: any) =>
                //                         attribute.id === "wRRYuIS8JKN"
                //                 );
                //                 const isDecreasing =
                //                     decreasing && decreasing.value;
                //                 return {
                //                     id,
                //                     name,
                //                     code,
                //                     intervention: degName,
                //                     interventionCode: degCode,
                //                     subKeyResultArea: name,
                //                     subKeyResultAreaCode: code,
                //                     degId,
                //                     keyResultArea: name,
                //                     keyResultAreaCode: code,
                //                     theme: "",

                //                 };
                //             }
                //         );
                //     }
                // );
                const dataSources = await getIndex<IDataSource>(storage, {
                    namespace: "i-data-sources",
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
                categoriesApi.setCategories(categories);
                dataSourcesApi.setDataSources(dataSources);
                dashboardApi.setCurrentDashboard(dashboard);
                storeApi.changeSelectedDashboard(dashboard.id);
                storeApi.changeSelectedCategory(dashboard.category || "");
                indicatorsApi.setVisualizationQueries(queries);

                if (
                    dashboard.nodeSource &&
                    dashboard.nodeSource.search &&
                    dashboard.nodeSource.search === "deg"
                ) {
                    const data = await db.dataElements.toArray();
                    const dataElementGroups = uniq(
                        data.map(({ degId }) => degId)
                    );
                    storeApi.setDataElementGroups(dataElementGroups);
                }
                if (
                    dashboard.nodeSource &&
                    dashboard.nodeSource.search &&
                    dashboard.nodeSource.search === "degs"
                ) {
                    const data = await db.dataElements.toArray();
                    const dataElementGroupSets = uniq(
                        data.map(({ degsId }) => degsId)
                    );
                    storeApi.setDataElementGroupSets(dataElementGroupSets);
                }

                const current = {
                    isLeaf: !dashboard.hasChildren,
                    id: dashboard.id,
                    pId: "",
                    key: dashboard.id,
                    style: { bg: "yellow", fontWeight: "bold" },
                    title: dashboard.name || "",
                    checkable: false,
                    nodeSource: dashboard.nodeSource,
                    hasChildren: dashboard.hasChildren,
                };
                await db.dashboards.put(current);
            }
            return true;
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
    key: string[]
) => {
    const engine = useDataEngine();
    return useQuery<TData[], Error>([namespace, ...key], async ({ signal }) => {
        try {
            return await getIndex(storage, {
                namespace,
                systemId,
                otherQueries: [],
                signal,
                engine,
            });
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
    onQuery: Event<TData>,
    onFailedData: TData
) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>([namespace, id], async ({ signal }) => {
        try {
            const data = await getOneRecord<TData>(storage, id, {
                namespace,
                otherQueries: [],
                signal,
                engine,
                systemId,
            });
            if (data) {
                onQuery(data);
            } else {
                onQuery(onFailedData);
            }

            return true;
        } catch (error) {
            onQuery(onFailedData);
            console.error(error);
            return false;
        }
    });
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

export const useDimensions = (
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();

    return useQuery<any[], Error>(["dimensions", isCurrentDHIS2], async () => {
        if (isCurrentDHIS2) {
            const {
                dimensions: { dimensions },
            }: any = await engine.query({
                dimensions: {
                    resource: `dimensions.json`,
                    params: {
                        fields: "id,name,items[id,name]",
                        paging: "false",
                    },
                },
            });
            return dimensions;
        } else if (currentDataSource) {
            const {
                data: { dimensions },
            } = await currentDataSource.get("dimensions", {
                params: { fields: "id,name,items[id,name]", paging: "false" },
            });
            return dimensions;
        }
        return [];
    });
};

export const useDataElements = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
        order: "name:ASC",
    };

    if (q) {
        params = {
            ...params,
            filter: `identifiable:token:${q}`,
        };
    }
    return useQuery<{ id: string; name: string }[], Error>(
        ["data-elements", page, pageSize, q, isCurrentDHIS2],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        dataElements,
                        pager: { total: totalDataElements },
                    },
                }: any = await engine.query({
                    elements: {
                        resource: "dataElements.json",
                        params,
                    },
                });
                paginationApi.addPagination({ totalDataElements });
                return dataElements;
            } else if (currentDataSource) {
                const {
                    data: {
                        dataElements,
                        pager: { total: totalDataElements },
                    },
                } = await currentDataSource.get("dataElements.json", {
                    params,
                });
                paginationApi.addPagination({ totalDataElements });
                return dataElements;
            }
            return [];
        }
    );
};

export const useDataElementGroups = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
        order: "name:ASC",
    };

    if (q) {
        params = {
            ...params,
            filter: `name:ilike:${q}`,
        };
    }
    return useQuery<{ id: string; name: string }[], Error>(
        ["data-element-groups", page, pageSize, q],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        dataElementGroups,
                        pager: { total: totalDataElementGroups },
                    },
                }: any = await engine.query({
                    elements: {
                        resource: "dataElementGroups.json",
                        params,
                    },
                });
                paginationApi.addPagination({ totalDataElementGroups });
                return dataElementGroups;
            } else if (currentDataSource) {
                const {
                    data: {
                        dataElementGroups,
                        pager: { total: totalDataElementGroups },
                    },
                } = await currentDataSource.get("dataElementGroups.json", {
                    params,
                });
                paginationApi.addPagination({ totalDataElementGroups });
                return dataElementGroups;
            }
            return [];
        }
    );
};

export const useDataElementGroupSets = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
        order: "name:ASC",
    };

    if (q) {
        params = {
            ...params,
            filter: `identifiable:token:${q}`,
        };
    }
    const namespaceQuery = {
        elements: {
            resource: "dataElementGroupSets.json",
            params,
        },
    };
    return useQuery<{ id: string; name: string }[], Error>(
        ["data-element-group-sets", page, pageSize, q],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        dataElementGroupSets,
                        pager: { total: totalDataElementGroupSets },
                    },
                }: any = await engine.query(namespaceQuery);
                paginationApi.addPagination({ totalDataElementGroupSets });
                return dataElementGroupSets;
            } else if (currentDataSource) {
                const {
                    data: {
                        dataElementGroupSets,
                        pager: { total: totalDataElementGroupSets },
                    },
                } = await currentDataSource.get("dataElementGroupSets.json", {
                    params,
                });
                paginationApi.addPagination({ totalDataElementGroupSets });
                return dataElementGroupSets;
            }
            return [];
        }
    );
};

export const useIndicators = (
    page: number,
    pageSize: number,
    q = "",
    selectedIndicators: string[] = [],
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();

    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
        order: "name:ASC",
    };

    let selectedIndicatorsQuery = {};

    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    const query = {
        elements: {
            resource: "indicators.json",
            params,
        },
        ...selectedIndicatorsQuery,
    };
    return useQuery<{ id: string; name: string }[], Error>(
        ["indicators", page, pageSize, q],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        indicators,
                        pager: { total: totalIndicators },
                    },
                }: any = await engine.query(query);
                paginationApi.addPagination({ totalIndicators });
                return indicators;
            } else if (currentDataSource) {
                const {
                    data: {
                        indicators,
                        pager: { total: totalIndicators },
                    },
                } = await currentDataSource.get("indicators.json", {
                    params,
                });
                paginationApi.addPagination({ totalIndicators });
                return indicators;
            }

            return [];
        }
    );
};

export const useSQLViews = (
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    const params = {
        paging: "false",
        fields: "id,name,sqlQuery",
    };
    const query = {
        elements: {
            resource: "sqlViews.json",
            params,
        },
    };
    return useQuery<{ id: string; name: string; sqlQuery: string }[], Error>(
        ["sql-views"],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: { sqlViews },
                }: any = await engine.query(query);
                return sqlViews;
            } else if (currentDataSource) {
                const {
                    data: { sqlViews },
                } = await currentDataSource.get("sqlViews.json", { params });
                return sqlViews;
            }
            return [];
        }
    );
};

export const useProgramIndicators = (
    page: number,
    pageSize: number,
    q = "",
    selectedProgramIndicators: string[] = [],
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
        order: "name:ASC",
    };

    let selectedProgramIndicatorsQuery = {};

    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    const query = {
        elements: {
            resource: "programIndicators.json",
            params,
        },
        ...selectedProgramIndicatorsQuery,
    };
    return useQuery<{ id: string; name: string }[], Error>(
        ["program-indicators", page, pageSize, q],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        programIndicators,
                        pager: { total: totalProgramIndicators },
                    },
                }: any = await engine.query(query);
                paginationApi.addPagination({ totalProgramIndicators });
                return programIndicators;
            } else if (currentDataSource) {
                const {
                    data: {
                        programIndicators,
                        pager: { total: totalProgramIndicators },
                    },
                } = await currentDataSource.get("programIndicators.json", {
                    params,
                });
                paginationApi.addPagination({ totalProgramIndicators });
                return programIndicators;
            }

            return [];
        }
    );
};

export const useOrganisationUnitGroups = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
    };
    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    const query = {
        elements: {
            resource: "organisationUnitGroups.json",
            params,
        },
    };
    return useQuery<{ id: string; name: string }[], Error>(
        ["organisation-unit-groups", page, pageSize],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        organisationUnitGroups,
                        pager: { total: totalOrganisationUnitGroups },
                    },
                }: any = await engine.query(query);
                paginationApi.addPagination({ totalOrganisationUnitGroups });
                return organisationUnitGroups;
            } else if (currentDataSource) {
                const {
                    data: {
                        organisationUnitGroups,
                        pager: { total: totalOrganisationUnitGroups },
                    },
                } = await currentDataSource.get("organisationUnitGroups.json", {
                    params,
                });
                paginationApi.addPagination({ totalOrganisationUnitGroups });
                return organisationUnitGroups;
            }

            return [];
        }
    );
};

export const useOrganisationUnitGroupSets = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,name",
    };
    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    const query = {
        elements: {
            resource: "organisationUnitGroupSets.json",
            params,
        },
    };
    return useQuery<{ id: string; name: string }[], Error>(
        ["organisation-unit-group-sets", page, pageSize],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        organisationUnitGroupSets,
                        pager: { total: totalOrganisationUnitGroupSets },
                    },
                }: any = await engine.query(query);
                paginationApi.addPagination({ totalOrganisationUnitGroupSets });
                return organisationUnitGroupSets;
            } else if (currentDataSource) {
                const {
                    data: {
                        organisationUnitGroupSets,
                        pager: { total: totalOrganisationUnitGroupSets },
                    },
                } = await currentDataSource.get(
                    "organisationUnitGroupSets.json",
                    {
                        params,
                    }
                );
                paginationApi.addPagination({ totalOrganisationUnitGroupSets });
                return organisationUnitGroupSets;
            }

            return [];
        }
    );
};

export const useOrganisationUnitLevels = (
    page: number,
    pageSize: number,
    q = "",
    isCurrentDHIS2: boolean | undefined,
    currentDataSource: AxiosInstance | undefined
) => {
    const engine = useDataEngine();
    let params: { [key: string]: any } = {
        page,
        pageSize,
        fields: "id,level,name",
    };
    if (q) {
        params = { ...params, filter: `identifiable:token:${q}` };
    }
    const query = {
        elements: {
            resource: "organisationUnitLevels.json",
            params,
        },
    };
    return useQuery<{ id: string; name: string; level: number }[], Error>(
        ["organisation-unit-levels", page, pageSize],
        async () => {
            if (isCurrentDHIS2) {
                const {
                    elements: {
                        organisationUnitLevels,
                        pager: { total: totalOrganisationUnitLevels },
                    },
                }: any = await engine.query(query);
                paginationApi.addPagination({ totalOrganisationUnitLevels });
                return organisationUnitLevels;
            } else if (currentDataSource) {
                const {
                    data: {
                        organisationUnitLevels,
                        pager: { total: totalOrganisationUnitLevels },
                    },
                } = await currentDataSource.get("organisationUnitLevels.json", {
                    params,
                });
                paginationApi.addPagination({ totalOrganisationUnitLevels });
                return organisationUnitLevels;
            }

            return [];
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

export const findLevelsAndOus = (indicator: IIndicator | undefined) => {
    if (indicator) {
        const denDimensions = indicator.denominator?.dataDimensions || {};
        const numDimensions = indicator.numerator?.dataDimensions || {};
        const denExpressions = indicator.denominator?.expressions || {};
        const numExpressions = indicator.numerator?.expressions || {};
        const ous = uniq([
            ...Object.entries(denDimensions)
                .filter(([key, { resource }]) => resource === "ou")
                .map(([key]) => key),
            ...Object.entries(numDimensions)
                .filter(([_, { resource }]) => resource === "ou")
                .map(([key]) => key),
            ...Object.entries(denExpressions)
                .filter(([key]) => key === "ou")
                .map(([key, value]) => value.value),
            ...Object.entries(numExpressions)
                .filter(([key]) => key === "ou")
                .map(([key, value]) => value.value),
        ]);
        const levels = uniq([
            ...Object.entries(denDimensions)
                .filter(([key, { resource }]) => resource === "oul")
                .map(([key]) => key),
            ...Object.entries(numDimensions)
                .filter(([_, { resource }]) => resource === "oul")
                .map(([key]) => key),
            ...Object.entries(denExpressions)
                .filter(([key]) => key === "oul")
                .map(([key, value]) => value.value),
            ...Object.entries(numExpressions)
                .filter(([key]) => key === "oul")
                .map(([key, value]) => value.value),
        ]);
        return { levels, ous };
    }
    return { levels: [], ous: [] };
};

const makeDHIS2Query = (
    data: IData,
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: any } = {}
) => {
    const filtered = fromPairs(
        Object.entries(data.dataDimensions).filter(
            ([id, dimension]) => dimension.type && dimension.dimension
        )
    );
    const allDimensions = findDimension(filtered, globalFilters);

    return Object.entries(
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

const generateDHIS2Query = (
    indicators: IIndicator[],
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: string } = {}
) => {
    return indicators.map((indicator) => {
        let query: { numerator?: string; denominator?: string } = {};
        if (
            indicator.numerator?.type === "ANALYTICS" &&
            Object.keys(indicator.numerator.dataDimensions).length > 0
        ) {
            const params = makeDHIS2Query(
                indicator.numerator,
                globalFilters,
                overrides
            );
            if (params) {
                query = {
                    ...query,
                    numerator: `analytics.json?${params}`,
                };
            }
        } else if (
            indicator.numerator?.type === "SQL_VIEW" &&
            Object.keys(indicator.numerator.dataDimensions).length > 0
        ) {
            let currentParams = "";
            const allParams = fromPairs(
                getSearchParams(indicator.numerator.query).map((re) => [
                    `var=${re}`,
                    "NULL",
                ])
            );
            const params = makeSQLViewsQueries(
                indicator.numerator.expressions,
                globalFilters,
                allParams
            );
            if (params) {
                currentParams = `?${params}&paging=false`;
            }
            query = {
                ...query,
                numerator: `sqlViews/${
                    Object.keys(indicator.numerator.dataDimensions)[0]
                }/data.json${currentParams}`,
            };
        }
        if (
            indicator.denominator?.type === "ANALYTICS" &&
            Object.keys(indicator.denominator.dataDimensions).length > 0
        ) {
            const params = makeDHIS2Query(indicator.denominator, globalFilters);
            if (params) {
                query = {
                    ...query,
                    denominator: `analytics.json?${params}`,
                };
            }
        } else if (
            indicator.denominator?.type === "SQL_VIEW" &&
            Object.keys(indicator.denominator.dataDimensions).length > 0
        ) {
            let currentParams = "";
            const allParams = fromPairs(
                getSearchParams(indicator.denominator.query).map((re) => [
                    `var=${re}`,
                    "NULL",
                ])
            );
            const params = makeSQLViewsQueries(
                indicator.denominator.expressions,
                globalFilters,
                allParams
            );
            if (params) {
                currentParams = `?${params}&paging=false`;
            }
            query = {
                ...query,
                denominator: `sqlViews/${
                    Object.keys(indicator.denominator.dataDimensions)[0]
                }/data.json${currentParams}`,
            };
        }
        return { query, indicator };
    });
};

const generateKeys = (
    indicators: IIndicator[] = [],
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
    data: any,
    options: Partial<{
        fromColumn: string;
        toColumn: string;
        flatteningOption: string;
        joinData: any[];
        otherFilters: { [key: string]: any };
        fromFirst: boolean;
    }>
) => {
    if (data.headers || data.listGrid) {
        let rows: string[][] | undefined = undefined;
        let headers: any[] | undefined = undefined;
        if (data.listGrid) {
            headers = data.listGrid.headers;
            rows = data.listGrid.rows;
        } else {
            headers = data.headers;
            rows = data.rows;
        }
        if (headers !== undefined && rows !== undefined) {
            const processed = flattenDHIS2Data(
                rows.map((row: string[]) => {
                    let others = {};

                    if (data.metaData && data.metaData.items) {
                        row.forEach((r, index) => {
                            if (index < row.length - 1) {
                                others = {
                                    ...others,
                                    [`${headers?.[index].name}-name`]:
                                        data.metaData.items[r]?.name || "",
                                };
                            }
                        });
                    }
                    return {
                        ...others,
                        ...fromPairs(
                            row.map((value, index) => {
                                const header = headers?.[index];
                                return [header.name, value];
                            })
                        ),
                    };
                }),
                options.flatteningOption
            );
            if (options.joinData && options.fromColumn && options.toColumn) {
                return merge2DataSources(
                    processed,
                    options.joinData,
                    options.fromColumn,
                    options.toColumn,
                    options.fromFirst || false
                );
            }

            if (!isEmpty(options.otherFilters)) {
                return processed.filter((data: any) => {
                    const values = Object.entries(
                        options.otherFilters || {}
                    ).map(
                        ([key, value]) =>
                            data[key] === String(value).padStart(2, "0")
                    );
                    return every(values);
                });
            }
            return processed;
        }
    }
    if (options.joinData && options.fromColumn && options.toColumn) {
        const merged = merge2DataSources(
            flattenDHIS2Data(data, options.flatteningOption),
            options.joinData,
            options.fromColumn,
            options.toColumn,
            options.fromFirst || false
        );
        if (!isEmpty(options.otherFilters)) {
            return merged.filter((data: any) => {
                const values = Object.entries(options.otherFilters || {}).map(
                    ([key, value]) =>
                        data[key] === String(value).padStart(2, "0")
                );
                return every(values);
            });
        }
        return merged;
    }

    return flattenDHIS2Data(data, options.flatteningOption);
};

const getDHIS2Query = (
    query: IData,
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: string } = {}
) => {
    if (query.type === "ANALYTICS") {
        const params = makeDHIS2Query(query, globalFilters, overrides);
        return `analytics.json?${params}&aggregationType=MAX`;
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

const queryDHIS2 = async (
    engine: any,
    vq: IData | undefined,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    if (vq) {
        const joinData: any = await queryDHIS2(
            engine,
            vq.joinTo,
            globalFilters,
            otherFilters
        );
        if (vq.dataSource && vq.dataSource.type === "DHIS2") {
            const query = getDHIS2Query(vq, globalFilters);
            if (vq.dataSource.isCurrentDHIS2) {
                const { data } = await engine.query({
                    data: {
                        resource: query,
                    },
                });
                return processDHIS2Data(data, {
                    flatteningOption: vq.flatteningOption,
                    joinData,
                    otherFilters,
                    fromColumn: vq.fromColumn,
                    toColumn: vq.toColumn,
                    fromFirst: vq.fromFirst,
                });
            }
            const { data } = await axios.get(
                `${vq.dataSource.authentication.url}/api/${query}`,
                {
                    auth: {
                        username: vq.dataSource.authentication.username,
                        password: vq.dataSource.authentication.password,
                    },
                }
            );

            return processDHIS2Data(data, {
                flatteningOption: vq.flatteningOption,
                joinData,
                otherFilters,
                fromColumn: vq.fromColumn,
                toColumn: vq.toColumn,
                fromFirst: vq.fromFirst,
            });
        }

        if (vq.dataSource && vq.dataSource.type === "API") {
            const { data } = await axios.get(vq.dataSource.authentication.url, {
                auth: {
                    username: vq.dataSource.authentication.username,
                    password: vq.dataSource.authentication.password,
                },
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
                }
            );
            return data;
        }
    }
    return undefined;
};

const computeIndicator = (
    indicator: IIndicator,
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
    indicator: IIndicator,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    const numerator = await queryDHIS2(
        engine,
        indicator.numerator,
        globalFilters,
        otherFilters
    );
    const denominator = await queryDHIS2(
        engine,
        indicator.denominator,
        globalFilters,
        otherFilters
    );

    if (numerator && denominator) {
        return numerator.map((currentValue: { [key: string]: string }) => {
            const { value: v1, total: t1, ...others } = currentValue;
            const columns = Object.values(others).sort().join("");

            const denominatorSearch = denominator.find(
                (row: { [key: string]: string }) => {
                    const { value, total, ...someOthers } = row;
                    return (
                        columns === Object.values(someOthers).sort().join("")
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
        });
    }
    return numerator;
};

const processVisualization = async (
    engine: any,
    visualization: IVisualization,
    globalFilters: { [key: string]: any } = {},
    otherFilters: { [key: string]: any } = {}
) => {
    const data = await Promise.all(
        visualization.indicators.map((indicator) =>
            queryIndicator(engine, indicator, globalFilters, otherFilters)
        )
    );

    visualizationDataApi.updateVisualizationData({
        visualizationId: visualization.id,
        data: flatten(data),
    });
    return flatten(data);
};

export const useVisualization = (
    visualization: IVisualization,
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
            ...visualization.indicators.map(({ id }) => id),
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
        { refetchInterval: 7 }
    );
};

export const saveDocument = async <TData extends INamed>(
    storage: Storage,
    index: string,
    systemId: string,
    document: Partial<TData>,
    engine: any,
    type: "create" | "update"
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
