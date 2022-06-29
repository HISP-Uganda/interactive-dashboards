import { useDataEngine } from "@dhis2/app-runtime";
import type { DataNode } from "antd/lib/tree";
import axios, { AxiosRequestConfig } from "axios";
import { fromPairs, max, uniq } from "lodash";
import { useQuery } from "react-query";
import {
  addPagination,
  changeAdministration,
  changeDefaults,
  changeHasDashboards,
  changeSelectedCategory,
  changeSelectedDashboard,
  onChangeOrganisations,
  setCategories,
  setCurrentDashboard,
  setDashboards,
  setDataSources,
  setVisualizationQueries,
  updateVisualizationData,
  updateVisualizationMetadata,
} from "./Events";
import {
  ICategory,
  IDashboard,
  IData,
  IDataSource,
  IDimension,
  IExpressions,
  IIndicator,
  IVisualization,
  Option,
} from "./interfaces";
import { getNestedKeys, traverse } from "./utils/utils";

export const api = axios.create({
  baseURL: "https://services.dhis2.hispuganda.org/",
});

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
        return {};
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

const loadResource = async (engine: any, namespace: string) => {
  const query = {
    resource: {
      resource: `dataStore/${namespace}`,
    },
  };
  try {
    const { resource }: any = await engine.query(query);
    const query1: any = fromPairs(
      resource.map((n: string) => [
        n,
        {
          resource: `dataStore/${namespace}/${n}`,
        },
      ])
    );
    const allData: { [key: string]: any } = await engine.query(query1);
    return Object.values(allData);
  } catch (error) {
    return [];
  }
};

const loadSingleResource = async (engine: any, resource: string) => {
  const query = {
    resource: {
      resource: `dataStore/${resource}`,
    },
  };
  try {
    const { resource }: any = await engine.query(query);
    return resource;
  } catch (error) {
    return null;
  }
};

export const useOrganisationUnits = () => {
  const engine = useDataEngine();
  const ouQuery = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name,leaf]",
      },
    },
    levels: {
      resource: "organisationUnitLevels.json",
      params: {
        fields: "id,level,name",
      },
    },
    groups: {
      resource: "organisationUnitGroups.json",
      params: {
        fields: "id,name",
      },
    },
  };

  return useQuery<
    { units: DataNode[]; levels: Option[]; groups: Option[] },
    Error
  >(["organisation-units"], async () => {
    const {
      me: { organisationUnits },
      levels: { organisationUnitLevels },
      groups: { organisationUnitGroups },
    }: any = await engine.query(ouQuery);

    const units: DataNode[] = organisationUnits.map((o: any) => {
      return {
        key: o.id,
        title: o.name,
        isLeaf: o.leaf,
      };
    });

    const levels: Option[] = organisationUnitLevels.map(
      ({ level, name }: any) => {
        return {
          label: name,
          value: level,
        };
      }
    );

    const groups: Option[] = organisationUnitGroups.map(({ id, name }: any) => {
      return {
        label: name,
        value: id,
      };
    });

    return {
      units,
      levels,
      groups,
    };
  });
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
  };
  return useQuery<any, Error>(["initial"], async () => {
    try {
      const {
        me: { organisationUnits, authorities },
      }: any = await engine.query(ouQuery);
      const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;

      changeAdministration(isAdmin);
      const facilities: React.Key[] = organisationUnits.map(
        (unit: any) => unit.id
      );
      const level = max(organisationUnits.map((unit: any) => unit.level));

      onChangeOrganisations({
        levels: [String(level)],
        organisations: facilities,
        groups: [],
        expandedKeys: [],
      });
      const dashboards = await loadResource(engine, "i-dashboards");
      const categories = await loadResource(engine, "i-categories");
      const dataSources = await loadResource(engine, "i-data-sources");
      const visualizationQueries = await loadResource(
        engine,
        "i-visualization-queries"
      );
      const settings = await loadResource(engine, "i-dashboard-settings");
      if (isAdmin) {
        setDashboards(dashboards);
      } else {
        const publishedDashboards = dashboards.filter(
          (dashboard: IDashboard) => dashboard.published
        );
        setDashboards(publishedDashboards);
        if (publishedDashboards.length > 0) {
          setCurrentDashboard(publishedDashboards[0]);
          changeSelectedDashboard(publishedDashboards[0].id);
          changeSelectedCategory(publishedDashboards[0].category);
          changeHasDashboards(true);
        }
      }
      setCategories([
        ...categories,
        {
          id: "uDWxMNyXZeo",
          name: "Uncategorised",
          description: "Uncategorised",
        },
      ]);
      setDataSources(dataSources);
      setVisualizationQueries(visualizationQueries);
      if (settings.length > 0) {
        const defaults = await loadSingleResource(
          engine,
          "i-dashboard-settings/settings"
        );
        if (defaults !== null) {
          const dashboard: any = await loadSingleResource(
            engine,
            `i-dashboards/${defaults.default}`
          );
          if (dashboard !== null) {
            setCurrentDashboard(dashboard);
            changeDefaults();
          }
        }
      }
    } catch (error) {}
    return true;
  });
};

export const useDataSources = () => {
  const engine = useDataEngine();
  const namespaceQuery = {
    namespaceKeys: {
      resource: `dataStore/i-data-sources`,
    },
  };
  return useQuery<boolean, Error>(["data-sources"], async () => {
    try {
      const { namespaceKeys }: any = await engine.query(namespaceQuery);
      const query: any = fromPairs(
        namespaceKeys.map((n: string) => [
          n,
          {
            resource: `dataStore/i-data-sources/${n}`,
          },
        ])
      );
      const allData = await engine.query(query);
      const dataSources = Object.values(allData).map((x) => {
        let value = x as unknown as IDataSource;
        return value;
      });
      setDataSources(dataSources);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useDashboards = () => {
  const engine = useDataEngine();
  const namespaceQuery = {
    namespaceKeys: {
      resource: `dataStore/i-dashboards`,
    },
  };
  return useQuery<boolean, Error>(["dashboards"], async () => {
    try {
      const { namespaceKeys }: any = await engine.query(namespaceQuery);
      const query: any = fromPairs(
        namespaceKeys.map((n: string) => [
          n,
          {
            resource: `dataStore/i-dashboards/${n}`,
          },
        ])
      );
      const allData = await engine.query(query);
      const dashboards = Object.values(allData).map((x) => {
        let value = x as unknown as IDashboard;
        return value;
      });
      setDashboards(dashboards);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useCategories = () => {
  const engine = useDataEngine();
  const namespaceQuery = {
    namespaceKeys: {
      resource: `dataStore/i-categories`,
    },
  };
  return useQuery<boolean, Error>(["categories"], async () => {
    try {
      const { namespaceKeys }: any = await engine.query(namespaceQuery);
      const query: any = fromPairs(
        namespaceKeys.map((n: string) => [
          n,
          {
            resource: `dataStore/i-categories/${n}`,
          },
        ])
      );
      const allData = await engine.query(query);
      const categories = Object.values(allData).map((x) => {
        let value = x as unknown as ICategory;
        return value;
      });
      setCategories(categories);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useVisualizationData = () => {
  const engine = useDataEngine();
  const namespaceQuery = {
    namespaceKeys: {
      resource: `dataStore/i-visualization-queries`,
    },
  };
  return useQuery<boolean, Error>(["visualization-queries"], async () => {
    try {
      const { namespaceKeys }: any = await engine.query(namespaceQuery);
      const query: any = fromPairs(
        namespaceKeys.map((n: string) => [
          n,
          {
            resource: `dataStore/i-visualization-queries/${n}`,
          },
        ])
      );
      const allData = await engine.query(query);
      const visualizationQueries = Object.values(allData).map((x) => {
        let value = x as unknown as IIndicator;
        return value;
      });
      setVisualizationQueries(visualizationQueries);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useNamespace = (namespace: string) => {
  const engine = useDataEngine();
  const namespaceQuery = {
    namespaceKeys: {
      resource: `dataStore/${namespace}`,
    },
  };
  return useQuery<any[], Error>(["namespaces", namespace], async () => {
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
      const allData = await engine.query(query);
      return Object.values(allData);
    } catch (error) {
      console.error(error);
      return [];
    }
  });
};

export const useNamespaceKey = (namespace: string, key: string) => {
  const engine = useDataEngine();
  const namespaceQuery = {
    dashboard: {
      resource: `dataStore/${namespace}/${key}`,
    },
  };
  return useQuery<boolean, Error>(["namespace", namespace, key], async () => {
    const { dashboard }: any = await engine.query(namespaceQuery);
    setCurrentDashboard(dashboard);
    return true;
  });
};

export const useNamespaceKey2 = (namespace: string, key: string) => {
  const engine = useDataEngine();
  const namespaceQuery = {
    dashboard: {
      resource: `dataStore/${namespace}/${key}`,
    },
  };
  return useQuery<any, Error>(["namespace-key-2", namespace, key], async () => {
    const { dashboard }: any = await engine.query(namespaceQuery);
    return dashboard;
  });
};

export const useDataElements = (page: number, pageSize: number, q = "") => {
  console.log(q);
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
      resource: "dataElements.json",
      params,
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["data-elements", page, pageSize, q],
    async () => {
      const {
        elements: {
          dataElements,
          pager: { total: totalDataElements },
        },
      }: any = await engine.query(namespaceQuery);
      addPagination({ totalDataElements });
      return dataElements;
    }
  );
};

export const useIndicators = (page: number, pageSize: number, q = "") => {
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
      resource: "indicators.json",
      params,
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["indicators", page, pageSize, q],
    async () => {
      const {
        elements: {
          indicators,
          pager: { total: totalIndicators },
        },
      }: any = await engine.query(query);
      addPagination({ totalIndicators });
      return indicators;
    }
  );
};

export const useSQLViews = () => {
  const engine = useDataEngine();
  const query = {
    elements: {
      resource: "sqlViews.json",
      params: {
        paging: "false",
        fields: "id,name,sqlQuery",
      },
    },
  };
  return useQuery<{ id: string; name: string; sqlQuery: string }[], Error>(
    ["sql-views"],
    async () => {
      const {
        elements: { sqlViews },
      }: any = await engine.query(query);
      return sqlViews;
    }
  );
};

export const useProgramIndicators = (
  page: number,
  pageSize: number,
  q = ""
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
      resource: "programIndicators.json",
      params,
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["program-indicators", page, pageSize],
    async () => {
      const {
        elements: {
          programIndicators,
          pager: { total: totalProgramIndicators },
        },
      }: any = await engine.query(query);
      addPagination({ totalProgramIndicators });
      return programIndicators;
    }
  );
};

export const useOrganisationUnitGroups = (
  page: number,
  pageSize: number,
  q = ""
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
      const {
        elements: {
          organisationUnitGroups,
          pager: { total: totalOrganisationUnitGroups },
        },
      }: any = await engine.query(query);
      addPagination({ totalOrganisationUnitGroups });
      return organisationUnitGroups;
    }
  );
};

export const useOrganisationUnitLevels = (
  page: number,
  pageSize: number,
  q = ""
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
      const {
        elements: {
          organisationUnitLevels,
          pager: { total: totalOrganisationUnitLevels },
        },
      }: any = await engine.query(query);
      addPagination({ totalOrganisationUnitLevels });
      return organisationUnitLevels;
    }
  );
};

const findDimension = (dimension: IDimension, t: string, w: string) => {
  return Object.entries(dimension)
    .filter(([key, { what, type }]) => type === t && what === w)
    .map(([key]) => key)
    .join(";");
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
  globalFilters: { [key: string]: any } = {}
) => {
  const ouDimensions = findDimension(data.dataDimensions, "dimension", "ou");
  const ouFilters = findDimension(data.dataDimensions, "filter", "ou");
  const iDimensions = findDimension(data.dataDimensions, "dimension", "i");
  const iFilters = findDimension(data.dataDimensions, "filter", "i");
  const peDimensions = findDimension(data.dataDimensions, "dimension", "pe");
  const peFilters = findDimension(data.dataDimensions, "filter", "pe");
  return [
    joinItems(
      [
        [globalFilters[ouFilters]?.join(";") || ouFilters, "ou"],
        [globalFilters[iFilters]?.join(";") || iFilters, "dx"],
        [globalFilters[peFilters]?.join(";") || peFilters, "pe"],
      ],
      "filter"
    ),
    joinItems(
      [
        [globalFilters[ouDimensions]?.join(";") || ouDimensions, "ou"],
        [globalFilters[iDimensions]?.join(";") || iDimensions, "dx"],
        [globalFilters[peDimensions]?.join(";") || peDimensions, "pe"],
      ],
      "dimension"
    ),
  ].join("&");
};

const makeSQLViewsQueries = (
  expressions: IExpressions = {},
  globalFilters: { [key: string]: any } = {}
) => {
  return Object.entries(expressions)
    .flatMap(([col, val]) => {
      if (val.isGlobal) {
        if (globalFilters[val.value]) {
          return [`var=${col}:${globalFilters[val.value]}`];
        }
        return [];
      }
      return [`var=${col}:${val.value}`];
    })
    .join("&");
};

const generateDHIS2Query = (
  indicator: IIndicator,
  globalFilters: { [key: string]: any } = {}
) => {
  let queries = {};
  if (
    indicator.numerator?.type === "ANALYTICS" &&
    Object.keys(indicator.numerator.dataDimensions).length > 0
  ) {
    const params = makeDHIS2Query(indicator.numerator, globalFilters);
    if (params) {
      queries = {
        numerator: {
          resource: `analytics.json?${params}`,
        },
      };
    }
  } else if (
    indicator.numerator?.type === "SQL_VIEW" &&
    Object.keys(indicator.numerator.dataDimensions).length > 0
  ) {
    let currentParams = "";
    const params = makeSQLViewsQueries(
      indicator.numerator.expressions,
      globalFilters
    );
    if (params) {
      currentParams = `?${params}`;
    }
    queries = {
      numerator: {
        resource: `sqlViews/${
          Object.keys(indicator.numerator.dataDimensions)[0]
        }/data.json${currentParams}`,
      },
    };
  }
  if (
    indicator.denominator?.type === "ANALYTICS" &&
    Object.keys(indicator.denominator.dataDimensions).length > 0
  ) {
    const params = makeDHIS2Query(indicator.denominator, globalFilters);
    if (params) {
      queries = {
        ...queries,
        denominator: {
          resource: `analytics.json?${params}`,
        },
      };
    }
  } else if (
    indicator.denominator?.type === "SQL_VIEW" &&
    Object.keys(indicator.denominator.dataDimensions).length > 0
  ) {
    let currentParams = "";
    const params = makeSQLViewsQueries(
      indicator.denominator.expressions,
      globalFilters
    );
    if (params) {
      currentParams = `?${params}`;
    }
    queries = {
      denominator: {
        resource: `sqlViews/${
          Object.keys(indicator.denominator.dataDimensions)[0]
        }/data.json${currentParams}`,
      },
    };
  }
  return queries;
};

const generateKeys = (
  indicator?: IIndicator,
  globalFilters: { [key: string]: any } = {}
) => {
  const numKeys = Object.keys(indicator?.numerator?.dataDimensions || {});
  const denKeys = Object.keys(indicator?.denominator?.dataDimensions || {});
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

  const all = uniq([
    ...numKeys,
    ...denKeys,
    ...numExpressions,
    ...denExpressions,
  ]).flatMap((id) => {
    return globalFilters[id] || [id];
  });
  return all;
};

export const useVisualization = (
  visualization: IVisualization,
  indicator?: IIndicator,
  dataSource?: IDataSource,
  refreshInterval?: string,
  globalFilters?: { [key: string]: any }
) => {
  const engine = useDataEngine();
  let currentInterval: boolean | number = false;
  if (refreshInterval && refreshInterval !== "off") {
    currentInterval = Number(refreshInterval) * 1000;
  }
  const otherKeys = generateKeys(indicator, globalFilters);
  return useQuery<any, Error>(
    ["visualizations", indicator?.id, ...otherKeys],
    async () => {
      if (indicator && dataSource && dataSource.isCurrentDHIS2) {
        const queries = generateDHIS2Query(indicator, globalFilters);
        const data = await engine.query(queries);
        let processed: any[] = [];
        let metadata = {};

        if (data.numerator && data.denominator) {
          const numerator: any = data.numerator;
          const denominator: any = data.denominator;

          let denRows = [];
          let numRows = [];
          let denHeaders: any[] = [];

          if (numerator && numerator.listGrid) {
            const { rows } = numerator.listGrid;
            numRows = rows;
          } else if (numerator) {
            const {
              rows,
              metaData: { items },
            } = numerator;
            numRows = rows;
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
          const numerators = fromPairs<number>(
            numRows.map((r: string[]) => [
              r.slice(0, -1).join(""),
              Number(r[r.length - 1]),
            ])
          );
          processed = denRows.map((r: string[]) => {
            const currentDenKey = r.slice(0, -1).join("");
            const currentDenValue = Number(r[r.length - 1]);
            return fromPairs(
              denHeaders.map((h: any, i: number) => {
                if (i === denHeaders.length - 1) {
                  const currentNum = numerators[currentDenKey] || 0;
                  return [h.name, (currentNum * 100) / currentDenValue];
                }
                return [h.name, r[i]];
              })
            );
          });
        } else if (data.numerator) {
          const numerator: any = data.numerator;
          if (numerator && numerator.listGrid) {
            const { headers, rows } = numerator.listGrid;
            processed = rows.map((row: string[]) => {
              return fromPairs(
                headers.map((h: any, i: number) => [h.name, row[i]])
              );
            });
          } else if (numerator) {
            const {
              headers,
              rows,
              metaData: { items },
            } = numerator;
            processed = rows.map((row: string[]) => {
              return fromPairs(
                headers.map((h: any, i: number) => [h.name, row[i]])
              );
            });
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
      } else if (dataSource?.type === "ELASTICSEARCH") {
        if (indicator && indicator.query) {
          const queryString = JSON.parse(
            indicator.query
              .replaceAll("${ou}", globalFilters?.["mclvD0Z9mfT"])
              .replaceAll("${pe}", globalFilters?.["m5D13FqKZwN"])
              .replaceAll("${le}", globalFilters?.["GQhi6pRnTKF"])
              .replaceAll("${gp}", globalFilters?.["of2WvtwqbHR"])
          );
          const { data } = await axios.post(
            dataSource.authentication.url,
            queryString
          );
          updateVisualizationData({
            visualizationId: visualization.id,
            data: traverse(data, queryString),
          });
        }
      }
      return true;
    },
    { refetchInterval: currentInterval }
  );
};