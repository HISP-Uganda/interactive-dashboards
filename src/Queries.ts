import {
  ICategory,
  IData,
  IDataSource,
  IDimension,
  IIndicator,
  IVisualization,
} from "./interfaces";
import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import axios, { AxiosRequestConfig } from "axios";
import {
  setCurrentDashboard,
  loadDefaults,
  addPagination,
  changeDefaults,
  setDataSources,
  setCategories,
} from "./Events";

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

const loadResource = async (engine: any, resource: string) => {
  const query = {
    resource: {
      resource: `dataStore/${resource}`,
    },
  };
  try {
    const { resource }: any = await engine.query(query);
    return resource;
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
    const {
      me: { organisationUnits },
    }: any = await engine.query(ouQuery);
    try {
      const dashboards = await loadResource(engine, "i-dashboards");
      const categories = await loadResource(engine, "i-categories");
      const dataSources = await loadResource(engine, "i-data-sources");
      const settings = await loadResource(engine, "i-dashboard-settings");
      loadDefaults({
        dashboards,
        categories,
        organisationUnits: organisationUnits.map((unit: any) => {
          return {
            key: unit.id,
            title: unit.name,
            isLeaf: unit.leaf,
          };
        }),
        dataSources,
        settings,
      });
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
    } catch (error) {
      loadDefaults({
        dashboards: [],
        categories: [],
        organisationUnits,
        dataSources: [],
        settings: [],
      });
    }
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

export const useDataElements = (page: number, pageSize: number) => {
  const engine = useDataEngine();
  const namespaceQuery = {
    elements: {
      resource: "dataElements.json",
      params: {
        page,
        pageSize,
        filter: "domainType:eq:AGGREGATE",
        fields: "id,name",
      },
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["data-elements", page, pageSize],
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

export const useIndicators = (page: number, pageSize: number) => {
  const engine = useDataEngine();
  const query = {
    elements: {
      resource: "indicators.json",
      params: {
        page,
        pageSize,
        fields: "id,name",
      },
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["indicators", page, pageSize],
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
        fields: "id,name",
      },
    },
  };
  return useQuery<{ id: string; name: string }[], Error>(
    ["sql-views"],
    async () => {
      const {
        elements: { sqlViews },
      }: any = await engine.query(query);
      return sqlViews;
    }
  );
};

export const useProgramIndicators = (page: number, pageSize: number) => {
  const engine = useDataEngine();
  const query = {
    elements: {
      resource: "programIndicators.json",
      params: {
        page,
        pageSize,
        fields: "id,name",
      },
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

export const useOrganisationUnitGroups = (page: number, pageSize: number) => {
  const engine = useDataEngine();
  const query = {
    elements: {
      resource: "organisationUnitGroups.json",
      params: {
        page,
        pageSize,
        fields: "id,name",
      },
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

export const useOrganisationUnitLevels = (page: number, pageSize: number) => {
  const engine = useDataEngine();
  const query = {
    elements: {
      resource: "organisationUnitLevels.json",
      params: {
        page,
        pageSize,
        fields: "id,level,name",
      },
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

const makeDHIS2Query = (data: IData) => {
  if (data.type === "ANALYTICS") {
    const ouDimensions = findDimension(data.dataDimensions, "dimension", "ou");
    const ouFilters = findDimension(data.dataDimensions, "filter", "ou");
    const iDimensions = findDimension(data.dataDimensions, "dimension", "i");
    const iFilters = findDimension(data.dataDimensions, "filter", "i");
    const peDimensions = findDimension(data.dataDimensions, "dimension", "pe");
    const peFilters = findDimension(data.dataDimensions, "filter", "pe");

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
  }
  if (data.type === "SQL_VIEW") {
  }
  if (data.type === "OTHER") {
  }
  return "";
};

export const useVisualization = (visualization: IVisualization | undefined) => {
  const engine = useDataEngine();
  return useQuery<any, Error>(["visualizations"], async () => {
    // const allQueries = visualization?.indicators.flatMap(
    //   (indicator: IIndicator) => {
    //     if (indicator.dataSource?.isCurrentDHIS2) {
    //       let queries = {};
    //       if (
    //         indicator.numerator.type === "ANALYTICS" &&
    //         Object.keys(indicator.numerator.dataDimensions).length > 0
    //       ) {
    //         const params = makeDHIS2Query(indicator.numerator);
    //         if (params) {
    //           queries = {
    //             numerator: {
    //               resource: `analytics.json?${params}`,
    //             },
    //           };
    //         }
    //       } else if (
    //         indicator.numerator.type === "SQL_VIEW" &&
    //         Object.keys(indicator.numerator.dataDimensions).length > 0
    //       ) {
    //         queries = {
    //           numerator: {
    //             resource: `sqlViews/${
    //               Object.keys(indicator.numerator.dataDimensions)[0]
    //             }/data.json`,
    //           },
    //         };
    //       }
    //       if (!indicator.useInBuildIndicators) {
    //         if (
    //           indicator.denominator.type === "ANALYTICS" &&
    //           Object.keys(indicator.denominator.dataDimensions).length > 0
    //         ) {
    //           const params = makeDHIS2Query(indicator.denominator);
    //           if (params) {
    //             queries = {
    //               ...queries,
    //               denominator: {
    //                 resource: `analytics.json?${params}`,
    //               },
    //             };
    //           }
    //         } else if (
    //           indicator.denominator.type === "SQL_VIEW" &&
    //           Object.keys(indicator.denominator.dataDimensions).length > 0
    //         ) {
    //           queries = {
    //             denominator: {
    //               resource: `sqlViews/${
    //                 Object.keys(indicator.denominator.dataDimensions)[0]
    //               }/data.json`,
    //             },
    //           };
    //         }
    //       }
    //       return engine.query(queries);
    //     }
    //   }
    // );
    // if (allQueries) {
    //   return await Promise.all(allQueries);
    // }

    return [];
  });
};
