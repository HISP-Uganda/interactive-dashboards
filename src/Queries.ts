import { useDataEngine } from "@dhis2/app-runtime";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { fromPairs, groupBy, isEmpty, max, min, uniq } from "lodash";
import { evaluate } from "mathjs";
import { db } from "./db";
import {
    addPagination,
    changeAdministration,
    changeSelectedCategory,
    changeSelectedDashboard,
    setCategories,
    setCategory,
    setCurrentDashboard,
    setCurrentPage,
    setDataElementGroups,
    setDataElementGroupSets,
    setDataSets,
    setDataSource,
    setDataSources,
    setDefaultDashboard,
    setIndicator,
    setInstanceBaseUrl,
    setLevels,
    setMaxLevel,
    setMinSublevel,
    setOrganisations,
    setShowFooter,
    setShowSider,
    setSystemId,
    setSystemName,
    setTargetCategoryOptionCombos,
    setVisualizationQueries,
    updateVisualizationData,
    updateVisualizationMetadata,
} from "./Events";
import {
    DataNode,
    ICategory,
    IDashboard,
    IData,
    IDataSource,
    IDimension,
    IExpressions,
    IIndicator,
    IVisualization,
    Threshold,
} from "./interfaces";
import {
    createCategory,
    createDashboard,
    createDataSource,
    createIndicator,
} from "./Store";
import { getSearchParams, processMap } from "./utils/utils";

export const api = axios.create({
    baseURL: "https://services.dhis2.hispuganda.org/",
    // baseURL: "http://localhost:3001/",
});

const createApi = (ds: IDataSource) => {
    return axios.create({
        baseURL: `${ds.authentication.url}/api/`,
        auth: {
            username: ds.authentication.username,
            password: ds.authentication.password,
        },
    });
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

export const getIndex = async (
    namespace: string,
    systemId: string,
    otherQueries: any[] = [],
    signal?: AbortSignal
) => {
    let must: any[] = [
        {
            term: { "systemId.keyword": systemId },
        },
        ...otherQueries,
    ];
    try {
        let {
            data: {
                hits: { hits },
            },
        }: any = await api.post(
            "wal/search",
            {
                index: namespace,
                size: 1000,
                query: {
                    bool: {
                        must,
                    },
                },
            },
            { signal }
        );
        return hits.map(({ _source }: any) => _source);
    } catch (error) {
        return [];
    }
};

export const getOneRecord = async (
    index: string,
    id: string,
    signal: AbortSignal | undefined
) => {
    try {
        let {
            data: {
                body: { _source },
            },
        }: any = await api.post(
            "wal/get",
            {
                index,
                id,
            },
            { signal }
        );
        return _source;
    } catch (error) {
        return null;
    }
};

const loadResource = async (
    namespace: string,
    systemId: string,
    otherQueries: any[] = [],
    signal?: AbortSignal
) => {
    return await getIndex(namespace, systemId, otherQueries, signal);
};

export const useInitials = () => {
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

        // dataElementGroupSets: {
        //     resource:
        //         "dataElementGroupSets.json?filter=attributeValues.attribute.id:eq:MeGs34GOrPw&fields=dataElementGroups[id,name,code,dataElements[id,code,name,dataElementGroups[id,groupSets[id,attributeValues[value,attribute[id,name]]]]]],id,code,name,attributeValues[attribute[id,name],value]",
        // },
        // directives: {
        //     resource:
        //         "dataElementGroupSets/G5xzDCd4bhZ.json?fields=dataElementGroups[id,name,code,dataElements[id,code,name],attributeValues[attribute[id,name],value]],id,code,name",
        // },
        // programs: {
        //     resource: "optionSets/nZffnMQwoWr/options.json",
        // },
    };
    return useQuery<any, Error>(
        ["initial"],
        async ({ signal }) => {
            // const systemInfo = await db.systemInfo.get("1");
            // if (!systemInfo) {
            const {
                systemInfo: { systemId, systemName, instanceBaseUrl },
                me: { organisationUnits, authorities },
                levels: { organisationUnitLevels },
                groups: { organisationUnitGroups },
                dataSets: { dataSets },
            }: // dataElementGroupSets: { dataElementGroupSets },
            // directives: { dataElementGroups },
            // programs: { options },
            any = await engine.query(ouQuery);
            // const processedPrograms = fromPairs(
            //     options.map(({ code, name }: any) => [code, name])
            // );
            // const processedDirectives = dataElementGroups.flatMap(
            //     ({
            //         code: degCode,
            //         name: degName,
            //         dataElements,
            //         id: degId,
            //         attributeValues,
            //     }: any) => {
            //         return dataElements.map(({ id, name, code }: any) => {
            //             let programCode = "";
            //             const attribute = attributeValues.find(
            //                 ({ attribute }: any) =>
            //                     attribute.id === "UBWSASWdyfi"
            //             );
            //             if (attribute) {
            //                 programCode = attribute.value;
            //             }
            //             return {
            //                 id,
            //                 name,
            //                 code,
            //                 intervention: degName,
            //                 interventionCode: degCode,
            //                 subKeyResultArea: name,
            //                 subKeyResultAreaCode: code,
            //                 degId,
            //                 keyResultArea: name,
            //                 keyResultAreaCode: code,
            //                 theme: "",
            //                 program: processedPrograms[programCode] || "",
            //                 programCode,
            //             };
            //         });
            //     }
            // );

            // const processedGroupSets = dataElementGroupSets.flatMap(
            //     ({
            //         dataElementGroups,
            //         attributeValues,
            //         id: degsId,
            //         code: degsCode,
            //         name: degsName,
            //     }: any) => {
            //         const themeAttribute = attributeValues.find(
            //             (a: any) => a.attribute.id === "MeGs34GOrPw"
            //         );
            //         return dataElementGroups.flatMap(
            //             ({
            //                 code: degCode,
            //                 name: degName,
            //                 dataElements,
            //                 id: degId,
            //             }: any) => {
            //                 return dataElements.map(
            //                     ({
            //                         id,
            //                         name,
            //                         code,
            //                         dataElementGroups,
            //                     }: any) => {
            //                         let programCode = "";
            //                         const program = dataElementGroups.find(
            //                             ({ id }: any) => id === "OsfAXDfjEHp"
            //                         );
            //                         if (program) {
            //                             const groupSet = program.groupSets.find(
            //                                 ({ id }: any) =>
            //                                     id === "PeN6InXuGmD"
            //                             );
            //                             if (groupSet) {
            //                                 const attribute =
            //                                     groupSet.attributeValues.find(
            //                                         ({ attribute }: any) =>
            //                                             attribute.id ===
            //                                             "UBWSASWdyfi"
            //                                     );
            //                                 if (attribute) {
            //                                     programCode = attribute.value;
            //                                 }
            //                             }
            //                         }
            //                         return {
            //                             id,
            //                             name,
            //                             code,
            //                             intervention: degName,
            //                             interventionCode: degCode,
            //                             subKeyResultArea: name,
            //                             subKeyResultAreaCode: code,
            //                             degId,
            //                             keyResultArea: name,
            //                             keyResultAreaCode: code,
            //                             themeCode: themeAttribute?.value || "",
            //                             theme: "",
            //                             program:
            //                                 processedPrograms[programCode] ||
            //                                 "",
            //                             programCode,
            //                             degsId,
            //                             degsName,
            //                             degsCode,
            //                         };
            //                     }
            //                 );
            //             }
            //         );
            //     }
            // );
            const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;
            const facilities: string[] = organisationUnits.map(
                (unit: any) => unit.id
            );
            const maxLevel = organisationUnitLevels[0].value;
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
            const settings = await loadResource(
                "i-dashboard-settings",
                systemId,
                [],
                signal
            );
            const defaultDashboard = settings.find(
                (s: any) => s.id === systemId && s.default
            );
            if (defaultDashboard) {
                changeSelectedDashboard(defaultDashboard.default);
                setDefaultDashboard(defaultDashboard.default);
            }
            if (minSublevel && minSublevel + 1 <= maxLevel) {
                setMinSublevel(minSublevel + 1);
            } else {
                setMinSublevel(maxLevel);
            }
            setSystemId(systemId);
            setSystemName(systemName);
            setDataSets(dataSets);
            setInstanceBaseUrl(instanceBaseUrl);
            setOrganisations(facilities);
            setMaxLevel(maxLevel);
            changeAdministration(isAdmin);
            setLevels([
                minLevel === 1 ? "3" : `${minLevel ? minLevel + 1 : 4}`,
            ]);
            // updateVisualizationData({
            //     visualizationId: "keyResultAreas",
            //     data: [
            //         {
            //             value: uniq(processedGroupSets.map((e: any) => e.id))
            //                 .length,
            //         },
            //     ],
            // });
            // updateVisualizationData({
            //     visualizationId: "indicators",
            //     data: [{ value: processedGroupSets.length }],
            // });
            // updateVisualizationData({
            //     visualizationId: "interventions",
            //     data: [
            //         {
            //             value: uniq(
            //                 processedGroupSets.map(
            //                     (e: any) => e.interventionCode
            //                 )
            //             ).length,
            //         },
            //     ],
            // });
            updateVisualizationData({
                visualizationId: "outputs",
                data: [{ value: 0 }],
            });
            // updateVisualizationData({
            //     visualizationId: "directives",
            //     data: [{ value: dataElementGroups.length }],
            // });

            await db.systemInfo.bulkPut([
                { id: "1", systemId, systemName, instanceBaseUrl },
            ]);
            await db.organisations.bulkPut(availableUnits);
            await db.levels.bulkPut(organisationUnitLevels);
            await db.groups.bulkPut(organisationUnitGroups);
            await db.dataSets.bulkPut(dataSets);
            // await db.dataElements.bulkPut([
            //     ...processedGroupSets,
            //     ...processedDirectives,
            // ]);
            // }
            return true;
        },
        {}
    );
};

export const useDataSources = (systemId: string) => {
    return useQuery<IDataSource[], Error>(
        ["i-data-sources"],
        async ({ signal }) => {
            try {
                setCurrentPage("data-sources");
                setShowFooter(false);
                setShowSider(true);
                return await getIndex("i-data-sources", systemId, [], signal);
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};
export const useDataSource = (id: string) => {
    return useQuery<boolean, Error>(
        ["i-data-sources", id],
        async ({ signal }) => {
            const dataSource: IDataSource =
                (await getOneRecord("i-data-sources", id, signal)) ||
                createDataSource(id);
            setDataSource(dataSource);
            return true;
        }
    );
};

export const useDashboards = (systemId: string) => {
    return useQuery<IDashboard[], Error>(
        ["i-dashboards"],
        async ({ signal }) => {
            try {
                const dashboards = await getIndex(
                    "i-dashboards",
                    systemId,
                    [],
                    signal
                );
                const processed = dashboards.map((d: any) => {
                    const node: DataNode = {
                        isLeaf: !d.hasChildren,
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
    id: string,
    systemId: string,
    refresh: boolean = true
) => {
    const engine = useDataEngine();
    return useQuery<boolean, Error>(
        ["i-dashboards", id],
        async ({ signal }) => {
            if (refresh) {
                let dashboard: IDashboard | null = await getOneRecord(
                    "i-dashboards",
                    id,
                    signal
                );
                if (isEmpty(dashboard)) {
                    dashboard = createDashboard(id);
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
                    setTargetCategoryOptionCombos(categoryOptionCombos);
                }

                const queries = await getIndex(
                    "i-visualization-queries",
                    systemId,
                    [],
                    signal
                );
                const dataSources = await getIndex(
                    "i-data-sources",
                    systemId,
                    [],
                    signal
                );
                const categories = await getIndex(
                    "i-categories",
                    systemId,
                    [],
                    signal
                );
                setCategories(categories);
                setDataSources(dataSources);
                setCurrentDashboard(dashboard);
                changeSelectedDashboard(dashboard.id);
                changeSelectedCategory(dashboard.category || "");
                setVisualizationQueries(queries);

                if (
                    dashboard.nodeSource &&
                    dashboard.nodeSource.search &&
                    dashboard.nodeSource.search === "deg"
                ) {
                    const data = await db.dataElements.toArray();
                    const dataElementGroups = uniq(
                        data.map(({ degId }) => degId)
                    );
                    setDataElementGroups(dataElementGroups);
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
                    setDataElementGroupSets(dataElementGroupSets);
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

export const useCategories = (systemId: string) => {
    return useQuery<ICategory[], Error>(
        ["i-categories"],
        async ({ signal }) => {
            try {
                return await getIndex("i-categories", systemId, [], signal);
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useCategory = (id: string) => {
    return useQuery<void, Error>(["i-categories", id], async ({ signal }) => {
        try {
            let category = await getOneRecord("i-categories", id, signal);
            if (!category) {
                category = createCategory(id);
            }
            setCategory(category);
            return;
        } catch (error) {
            console.error(error);
        }
    });
};
export const useVisualizationData = (systemId: string) => {
    return useQuery<IIndicator[], Error>(
        ["i-visualization-queries"],
        async ({ signal }) => {
            try {
                return await getIndex(
                    "i-visualization-queries",
                    systemId,
                    [],
                    signal
                );
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    );
};

export const useVisualizationDatum = (id: string, systemId: string) => {
    return useQuery<boolean, Error>(
        ["i-visualization-queries", id],
        async ({ signal }) => {
            try {
                const dataSources = await getIndex(
                    "i-data-sources",
                    systemId,
                    [],
                    signal
                );
                let indicator = await getOneRecord(
                    "i-visualization-queries",
                    id,
                    signal
                );
                if (isEmpty(indicator)) {
                    indicator = createIndicator(id);
                }
                setDataSources(dataSources);
                setIndicator(indicator);
            } catch (error) {
                console.error(error);
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
                addPagination({ totalDataElements });
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
                addPagination({ totalDataElements });
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
                addPagination({ totalDataElementGroups });
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
                addPagination({ totalDataElementGroups });
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
                addPagination({ totalDataElementGroupSets });
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
                addPagination({ totalDataElementGroupSets });
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
                addPagination({ totalIndicators });
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
                addPagination({ totalIndicators });
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
                addPagination({ totalProgramIndicators });
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
                addPagination({ totalProgramIndicators });
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
                addPagination({ totalOrganisationUnitGroups });
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
                addPagination({ totalOrganisationUnitGroups });
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
                addPagination({ totalOrganisationUnitGroupSets });
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
                addPagination({ totalOrganisationUnitGroupSets });
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
                addPagination({ totalOrganisationUnitLevels });
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
                addPagination({ totalOrganisationUnitLevels });
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
        ([key, { resource, type, dimension, prefix, ...rest }]) => {
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

const joinItems = (items: string[][], joiner: "dimension" | "filter") => {
    return items
        .flatMap((item: string[]) => {
            if (item[0]) {
                return [`${joiner}=${item[1]}:${item[0]}`];
            }
            return [];
        })
        .join("&");
};

const makeDHIS2Query = (
    data: IData,
    globalFilters: { [key: string]: any } = {},
    overrides: { [key: string]: any } = {}
) => {
    const allDimensions = findDimension(data.dataDimensions, globalFilters);
    return Object.entries(
        groupBy(allDimensions, (v) => `${v.type}${v.dimension}`)
    )
        .flatMap(([x, y]) => {
            const first = y[0];
            const finalValues = y.map(({ value }) => value).join(";");
            if (first.dimension === "") {
                return y.map(({ value }) => `${first.type}=${value}`);
            }
            return [`${first.type}=${first.dimension}:${finalValues}`];
        })
        .join("&");
};

const hasGlobal = (globalFilters: { [key: string]: any }, value: string) => {
    return Object.keys(globalFilters).some((element) => {
        if (element.indexOf(value) !== -1) {
            return true;
        }
        return false;
    });
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
                    numerator: `analytics.json?${params}&aggregationType=MAX`,
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

export const useVisualization = (
    visualization: IVisualization,
    indicators: IIndicator[] = [],
    dataSources: IDataSource[] = [],
    refreshInterval?: string,
    globalFilters?: { [key: string]: any }
) => {
    const engine = useDataEngine();
    let currentInterval: boolean | number = false;
    if (refreshInterval && refreshInterval !== "off") {
        currentInterval = Number(refreshInterval) * 1000;
    }
    let processed: any[] = [];
    const otherKeys = generateKeys(indicators, globalFilters);
    const overrides = visualization.overrides || {};
    const dhis2Indicators = indicators.flatMap((indicator) => {
        const ds = dataSources.find(
            (dataSource) =>
                dataSource.id === indicator.dataSource &&
                dataSource.type === "DHIS2"
        );
        if (ds) {
            return { ...indicator, realDataSource: ds };
        }
        return [];
    });

    const elasticsearchIndicators = indicators.filter((indicator) => {
        const ds = dataSources.find(
            (dataSource) => dataSource.id === indicator.dataSource
        );
        return ds?.type === "ELASTICSEARCH";
    });
    const apiIndicators = indicators.filter((indicator) => {
        const ds = dataSources.find(
            (dataSource) => dataSource.id === indicator.dataSource
        );
        return ds?.type === "API";
    });
    return useQuery<any, Error>(
        [
            "visualizations",
            ...indicators.map(({ id }) => id),
            ...otherKeys,
            ...Object.values(overrides),
        ],
        async ({ signal }) => {
            if (
                dhis2Indicators.length > 0 &&
                !isEmpty(globalFilters) &&
                dataSources.length > 0
            ) {
                const queries = generateDHIS2Query(
                    dhis2Indicators,
                    globalFilters,
                    overrides
                );
                for (const { query, indicator } of queries) {
                    let allQueries: Promise<any>[] = [];
                    let dhis2Queries = {};
                    if (query.numerator) {
                        if (indicator.realDataSource?.isCurrentDHIS2) {
                            dhis2Queries = {
                                ...dhis2Queries,
                                numerator: {
                                    resource: query.numerator,
                                },
                            };
                        } else {
                            allQueries = [
                                ...allQueries,
                                axios.get(
                                    `${
                                        indicator.realDataSource?.authentication
                                            .url || ""
                                    }/api/${query.numerator}`,
                                    {
                                        auth: {
                                            username:
                                                indicator.realDataSource
                                                    ?.authentication.username ||
                                                "",
                                            password:
                                                indicator.realDataSource
                                                    ?.authentication.password ||
                                                "",
                                        },
                                    }
                                ),
                            ];
                        }
                    }
                    if (query.denominator) {
                        if (indicator.realDataSource?.isCurrentDHIS2) {
                            dhis2Queries = {
                                ...dhis2Queries,
                                denominator: {
                                    resource: query.denominator,
                                },
                            };
                        } else {
                            allQueries = [
                                ...allQueries,
                                axios.get(
                                    `${
                                        indicator.realDataSource?.authentication
                                            .url || ""
                                    }/api/${query.denominator}`,
                                    {
                                        auth: {
                                            username:
                                                indicator.realDataSource
                                                    ?.authentication.username ||
                                                "",
                                            password:
                                                indicator.realDataSource
                                                    ?.authentication.password ||
                                                "",
                                        },
                                    }
                                ),
                            ];
                        }
                    }

                    let numerator = undefined;
                    let denominator = undefined;

                    if (Object.keys(dhis2Queries).length > 0) {
                        const response: any = await engine.query(dhis2Queries);

                        numerator = response.numerator;
                        denominator = response.denominator;
                    } else if (allQueries.length > 0) {
                        const response = await Promise.all(allQueries);
                        if (response.length === 2) {
                            const [{ data: num }, { data: den }] =
                                await Promise.all(allQueries);
                            numerator = num;
                            denominator = den;
                        }
                        const [{ data: num }] = await Promise.all(allQueries);
                        numerator = num;
                    }

                    let metadata = {};
                    if (numerator && denominator) {
                        let denRows = [];
                        let numRows = [];
                        let denHeaders: any[] = [];
                        let numHeaders: any[] = [];

                        if (numerator && numerator.listGrid) {
                            const { rows, headers } = numerator.listGrid;
                            numRows = rows;
                            numHeaders = headers;
                        } else if (numerator) {
                            const {
                                rows,
                                headers,
                                metaData: { items },
                            } = numerator;
                            numRows = rows;
                            numHeaders = headers;
                            metadata = items;
                        }
                        if (denominator && denominator.listGrid) {
                            const { headers, rows } = denominator.listGrid;
                            denRows = rows;
                            denHeaders = headers;
                        } else if (denominator) {
                            const {
                                headers,
                                rows,
                                metaData: { items },
                            } = denominator;
                            denRows = rows;
                            denHeaders = headers;
                            metadata = { ...metadata, ...items };
                        }

                        const numerators = numRows.map((rows: string[]) => {
                            return fromPairs(
                                rows.map((r: string, index: number) => [
                                    numHeaders[index].name,
                                    r,
                                ])
                            );
                        });

                        const denominators = denRows.map((rows: string[]) => {
                            return fromPairs(
                                rows.map((r: string, index: number) => [
                                    denHeaders[index].name,
                                    r,
                                ])
                            );
                        });

                        processed = [
                            ...processed,
                            ...numerators.map(
                                (numerator: { [key: string]: string }) => {
                                    const {
                                        value: v1,
                                        total: t1,
                                        ...others
                                    } = numerator;
                                    const columns = Object.values(others)
                                        .sort()
                                        .join("");

                                    const denominator = denominators.find(
                                        (row: { [key: string]: string }) => {
                                            const {
                                                value,
                                                total,
                                                ...someOthers
                                            } = row;
                                            return (
                                                columns ===
                                                Object.values(someOthers)
                                                    .sort()
                                                    .join("")
                                            );
                                        }
                                    );

                                    if (denominator) {
                                        const { value: v1, total: t1 } =
                                            numerator;
                                        const { value: v2, total: t2 } =
                                            denominator;

                                        if (indicator.custom && v1 && v2) {
                                            const expression = indicator.factor
                                                .replaceAll("x", v1)
                                                .replaceAll("y", v2);
                                            return {
                                                ...numerator,
                                                value: evaluate(expression),
                                            };
                                        }

                                        if (
                                            v1 &&
                                            v2 &&
                                            indicator.factor !== "1"
                                        ) {
                                            const computed =
                                                Number(v1) / Number(v2);
                                            return {
                                                ...numerator,
                                                value: evaluate(
                                                    `${computed}${indicator.factor}`
                                                ),
                                            };
                                        }

                                        if (v1 && v2) {
                                            const computed =
                                                Number(v1) / Number(v2);
                                            return {
                                                ...numerator,
                                                value: computed,
                                            };
                                        }

                                        if (indicator.custom && t1 && t2) {
                                            const expression = indicator.factor
                                                .replaceAll("x", t1)
                                                .replaceAll("y", t2);
                                            return {
                                                ...numerator,
                                                value: evaluate(expression),
                                            };
                                        }

                                        if (
                                            t1 &&
                                            t2 &&
                                            indicator.factor !== "1"
                                        ) {
                                            const computed =
                                                Number(t1) / Number(t2);
                                            return {
                                                ...numerator,
                                                value: evaluate(
                                                    `${computed}${indicator.factor}`
                                                ),
                                            };
                                        }
                                        if (t1 && t2) {
                                            const computed =
                                                Number(t1) / Number(t2);
                                            return {
                                                ...numerator,
                                                value: computed,
                                            };
                                        }
                                    }
                                    return { ...numerator, value: 0 };
                                }
                            ),
                        ];
                    } else if (numerator) {
                        if (numerator && numerator.listGrid) {
                            const { headers, rows } = numerator.listGrid;
                            if (rows.length > 0) {
                                let foundRows = rows.map((row: string[]) => {
                                    return fromPairs(
                                        headers.map((h: any, i: number) => {
                                            if (indicator.factor !== "1") {
                                                return [
                                                    h.name,
                                                    evaluate(
                                                        `${row[i]}${indicator.factor}`
                                                    ),
                                                ];
                                            }
                                            return [h.name, row[i]];
                                        })
                                    );
                                });

                                if (
                                    ["AHxO7yowduX", "a19pSPoyUl9"].indexOf(
                                        visualization.id
                                    ) !== -1 &&
                                    ["ejqSEwfG07O", "FOgNEFzg210"].indexOf(
                                        indicator.id
                                    ) !== -1
                                ) {
                                    const firstValue =
                                        foundRows[0].value ||
                                        foundRows[0].total;
                                    foundRows = [
                                        "daugmmgzAkU",
                                        "C1IRVkhB3MW",
                                        "L48zD78K9AI",
                                        "zPaWaUOubgL",
                                        "J9wUCeShAjk",
                                    ].map((c1) => {
                                        return {
                                            c1,
                                            c2: "Target",
                                            value: Number(
                                                Number(firstValue / 5).toFixed(
                                                    0
                                                )
                                            ),
                                        };
                                    });
                                }
                                processed = [...processed, ...foundRows];
                            } else {
                                processed = [
                                    ...processed,
                                    fromPairs(
                                        headers.map((h: any, i: number) => [
                                            h.name,
                                            0,
                                        ])
                                    ),
                                ];
                            }
                        } else if (numerator) {
                            const {
                                headers,
                                rows,
                                metaData: { items },
                            } = numerator;
                            if (rows.length > 0) {
                                processed = [
                                    ...processed,
                                    ...rows.map((row: string[]) => {
                                        return fromPairs(
                                            headers.map((h: any, i: number) => [
                                                h.name,
                                                row[i],
                                            ])
                                        );
                                    }),
                                ];
                            } else {
                                processed = [
                                    ...processed,
                                    fromPairs(
                                        headers.map((h: any, i: number) => [
                                            h.name,
                                            0,
                                        ])
                                    ),
                                ];
                            }
                            metadata = items;
                        }
                    }
                    updateVisualizationData({
                        visualizationId: visualization.id,
                        data: processed,
                    });
                    updateVisualizationMetadata({
                        visualizationId: visualization.id,
                        data: metadata,
                    });
                }
            } else if (
                elasticsearchIndicators.length > 0 &&
                !isEmpty(globalFilters) &&
                dataSources &&
                dataSources.length > 0
            ) {
                // if (indicator && indicator.query) {
                //   const queryString = JSON.parse(
                //     indicator.query
                //       .replaceAll("${ou}", globalFilters?.["mclvD0Z9mfT"])
                //       .replaceAll("${pe}", globalFilters?.["m5D13FqKZwN"])
                //       .replaceAll("${le}", globalFilters?.["GQhi6pRnTKF"])
                //       .replaceAll("${gp}", globalFilters?.["of2WvtwqbHR"])
                //   );
                //   const { data } = await axios.post(
                //     dataSource.authentication.url,
                //     queryString
                //   );
                //   processed = traverse(data, queryString);
                //   updateVisualizationData({
                //     visualizationId: visualization.id,
                //     data: processed,
                //   });
                // }
            } else if (
                apiIndicators.length > 0 &&
                !isEmpty(globalFilters) &&
                dataSources &&
                dataSources.length > 0
            ) {
                // const { data } = await axios.get(dataSource.authentication.url);
                // let numerator: any = undefined;
                // let denominator: any = undefined;
                // if (indicator?.numerator?.accessor) {
                //   numerator = data[indicator?.numerator?.accessor];
                // } else if (indicator?.numerator?.name) {
                //   numerator = data;
                // }
                // if (indicator?.denominator?.accessor) {
                //   denominator = data[indicator?.denominator?.accessor];
                // } else if (indicator?.denominator?.name) {
                //   denominator = data;
                // }
                // if (numerator && denominator) {
                // } else if (numerator) {
                //   processed = numerator;
                //   updateVisualizationData({
                //     visualizationId: visualization.id,
                //     data: numerator,
                //   });
                // }
            }
            return processed;
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

export const saveDocument = async (
    index: string,
    systemId: string,
    document: { [key: string]: any }
) => {
    const { data } = await api.post(`wal/index?index=${index}`, {
        ...document,
        systemId,
    });
    return data;
};

export const deleteDocument = async (index: string, id: string) => {
    const { data } = await api.post(`wal/delete?index=${index}&id=${id}`);
    return data;
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
            const {
                optionSet: { options },
            }: any = await engine.query(query);
            return options;
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
