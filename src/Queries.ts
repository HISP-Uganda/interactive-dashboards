import { RangeValue } from "rc-picker/lib/interface";
import { useDataEngine } from "@dhis2/app-runtime";
import axios, { AxiosRequestConfig } from "axios";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import { db } from "./db";
import {
  addPagination,
  changeDefaults,
  setCategories,
  setCurrentDashboard,
  setDashboards,
  setDataSources,
  setExpandedKeys,
  setOrganisations,
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
  IIndicator,
  IVisualization,
  Option,
  IExpression,
} from "./interfaces";

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

export const useInitials = () => {
  const engine = useDataEngine();
  const ouQuery = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name,leaf]",
      },
    },
  };
  return useQuery<any, Error>(["initial"], async () => {
    try {
      const facilities = await db.collection("facilities").get();
      const expandedKeys = await db.collection("expanded").get();

      if (facilities.length > 0) {
        setOrganisations(facilities);
        setExpandedKeys(expandedKeys.map((k: any) => k.value));
      } else {
        const {
          me: { organisationUnits },
        }: any = await engine.query(ouQuery);

        const facilities: any[] = organisationUnits.map((unit: any) => {
          const parent = {
            id: unit.id,
            pId: unit.pId || "",
            value: unit.id,
            title: unit.name,
            isLeaf: unit.leaf,
          };
          return parent;
        });
        const toBeSaved = facilities.map((facility: any) => {
          return { ...facility, _key: facility.id };
        });
        db.collection("facilities").set(toBeSaved, { keys: true });
        setOrganisations(facilities);
        setExpandedKeys([]);
      }

      const dashboards = await loadResource(engine, "i-dashboards");
      const categories = await loadResource(engine, "i-categories");
      const dataSources = await loadResource(engine, "i-data-sources");
      const visualizationQueries = await loadResource(
        engine,
        "i-visualization-queries"
      );
      const settings = await loadResource(engine, "i-dashboard-settings");
      setDashboards(dashboards);
      setCategories(categories);
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
  const engine = useDataEngine();
  let params: { [key: string]: any } = {
    page,
    pageSize,
    fields: "id,name",
  };

  if (q) {
    params = {
      ...params,
      filter: `identifiable:token:${q}&filter=domainType:eq:AGGREGATE`,
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

const useDataSourceQuery = (
  dataSource: IDataSource,
  url: string,
  params: { [key: string]: any }
) => {
  return useQuery<any, Error>(
    ["data-source", url, ...Object.values(params)],
    async () => {
      return queryDataSource(dataSource, url, params);
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
  console.log(globalFilters);
  return [
    joinItems(
      [
        [ouFilters, "ou"],
        [iFilters, "dx"],
        [peFilters, "pe"],
      ],
      "filter"
    ),
    joinItems(
      [
        [ouDimensions, "ou"],
        [iDimensions, "dx"],
        [peDimensions, "pe"],
      ],
      "dimension"
    ),
  ].join("&");
};

const makeSQLViewsQueries = (
  expressions: { [key: string]: string } = {},
  globalFilters: { [key: string]: any } = {},
  filters: { [key: string]: any } = {}
) => {
  return Object.entries(expressions)
    .map(([col, val]) => {
      return `var=${col}:${val}`;
    })
    .join("&");
};

const generateDHIS2Query = (indicator: IIndicator) => {
  let queries = {};
  if (
    indicator.numerator?.type === "ANALYTICS" &&
    Object.keys(indicator.numerator.dataDimensions).length > 0
  ) {
    const params = makeDHIS2Query(indicator.numerator);
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
    const params = makeSQLViewsQueries(indicator.numerator.expressions);
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
    const params = makeDHIS2Query(indicator.denominator);
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
    queries = {
      denominator: {
        resource: `sqlViews/${
          Object.keys(indicator.denominator.dataDimensions)[0]
        }/data.json`,
      },
    };
  }
  return queries;
};

const generateKeys = (
  indicator: IIndicator,
  selectedOrganisation?: string,
  periodType?: Option,
  relativePeriod?: Option,
  fixedPeriod?: RangeValue<moment.Moment>
) => {
  const allKeys = Object.keys(indicator?.denominator?.dataDimensions || {});
};

export const useVisualization = (
  visualization: IVisualization,
  indicator?: IIndicator,
  dataSource?: IDataSource,
  selectedOrganisation?: string,
  periodType?: Option,
  relativePeriod?: Option,
  fixedPeriod?: RangeValue<moment.Moment>,
  refreshInterval?: string
) => {
  const engine = useDataEngine();
  let currentInterval: boolean | number = false;
  if (refreshInterval && refreshInterval !== "off") {
    currentInterval = Number(refreshInterval) * 1000;
  }
  return useQuery<any, Error>(
    ["visualizations", indicator?.id],
    async () => {
      if (indicator && dataSource && dataSource.isCurrentDHIS2) {
        const queries = generateDHIS2Query(indicator);
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
        const api = axios.create({
          baseURL: dataSource.authentication.url,
        });
        if (indicator && indicator.query) {
          api.post("", JSON.parse(indicator.query));
        }
      }
      return true;
    },
    { refetchInterval: currentInterval }
  );
};
