import { useDataEngine } from "@dhis2/app-runtime";
import { center } from "@turf/turf";
import type { DataNode } from "antd/lib/tree";
import axios, { AxiosRequestConfig } from "axios";
import { fromPairs, isEmpty, uniq } from "lodash";
import { useQuery } from "react-query";
import OrganizationUnitGroups from "./components/data-sources/OrganisationUnitGroups";
import {
  addPagination,
  changeAdministration,
  changeDefaults,
  changeHasDashboards,
  changeSelectedCategory,
  changeSelectedDashboard,
  onChangeOrganisations,
  setAvailableCategories,
  setAvailableCategoryOptionCombos,
  setCategories,
  setCategorization,
  setCurrentDashboard,
  setDashboards,
  setDataSets,
  setDataSources,
  setDefaultDashboard,
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
import { getSearchParams, traverse } from "./utils/utils";

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
        console.log(error);
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
    dataSets: {
      resource: "dataSets.json",
      params: {
        fields: "id~rename(value),name~rename(label)",
      },
    },
  };
  return useQuery<any, Error>(["initial"], async () => {
    try {
      const {
        me: { organisationUnits, authorities },
        dataSets: { dataSets },
      }: any = await engine.query(ouQuery);
      setDataSets(dataSets);
      const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;
      changeAdministration(isAdmin);
      const facilities: React.Key[] = organisationUnits.map(
        (unit: any) => unit.id
      );
      onChangeOrganisations({
        levels: ["3"],
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
            changeSelectedDashboard(dashboard.id);
            changeSelectedCategory(dashboard.category);
            changeDefaults();
            setDefaultDashboard(defaults.default);
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
      const allData: { [key: string]: any } = await engine.query(query);

      const visualizationQueries = Object.values(allData);
      setVisualizationQueries(visualizationQueries);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useDataSet = (dataSet: string) => {
  const engine = useDataEngine();
  const namespaceQuery = {
    dataSet: {
      resource: `dataSets/${dataSet}`,
      params: {
        fields:
          "categoryCombo[categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]]",
      },
    },
  };
  return useQuery<void, Error>(["data-set", dataSet], async () => {
    try {
      const {
        dataSet: {
          categoryCombo: { categories, categoryOptionCombos },
        },
      }: any = await engine.query(namespaceQuery);
      setAvailableCategories(categories);
      setAvailableCategoryOptionCombos(categoryOptionCombos);
      const selectedCategories = categories.map(
        ({ id, categoryOptions }: any) => [id, [categoryOptions[0]]]
      );
      setCategorization(fromPairs(selectedCategories));
    } catch (error) {
      console.error(error);
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

export const useIndicators = (
  page: number,
  pageSize: number,
  q = "",
  selectedIndicators: string[] = []
) => {
  const engine = useDataEngine();

  let params: { [key: string]: any } = {
    page,
    pageSize,
    fields: "id,name",
    order: "name:ASC",
  };

  let selectedIndicatorsQuery = {};

  // if (selectedIndicators.length > 0) {
  //   selectedIndicatorsQuery = {
  //     ...selectedIndicatorsQuery,
  //     selected: {
  //       resource: "indicators.json",
  //       params: { ...params, filter: `id:in:${selectedIndicators.join(",")}` },
  //     },
  //   };
  // }

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

const findDimension2 = (
  dimension: IDimension,
  t: string,
  w: string,
  joiner: string
) => {
  return Object.entries(dimension)
    .filter(([key, { what, type }]) => type === t && what === w)
    .map(([key]) => `${joiner}${key}`)
    .join(";");
};

export const findLevelsAndOus = (indicator: IIndicator | undefined) => {
  if (indicator) {
    const denDimensions = indicator.denominator?.dataDimensions || {};
    const numDimensions = indicator.numerator?.dataDimensions || {};
    const denExpressions = indicator.denominator?.expressions || {};
    const numExpressions = indicator.numerator?.expressions || {};
    const ous = uniq([
      ...Object.entries(denDimensions)
        .filter(([key, { what }]) => what === "ou")
        .map(([key]) => key),
      ...Object.entries(numDimensions)
        .filter(([_, { what }]) => what === "ou")
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
        .filter(([key, { what }]) => what === "oul")
        .map(([key]) => key),
      ...Object.entries(numDimensions)
        .filter(([_, { what }]) => what === "oul")
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
  const ouDimensions = findDimension(data.dataDimensions, "dimension", "ou");
  const ouFilters = findDimension(data.dataDimensions, "filter", "ou");
  const iDimensions = findDimension(data.dataDimensions, "dimension", "i");
  const iFilters = findDimension(data.dataDimensions, "filter", "i");
  const peDimensions = findDimension(data.dataDimensions, "dimension", "pe");
  const peFilters = findDimension(data.dataDimensions, "filter", "pe");
  const ouLevelFilter = findDimension(data.dataDimensions, "filter", "oul");
  const ouLevelDimension = findDimension(
    data.dataDimensions,
    "dimension",
    "oul"
  );
  const ouGroupFilter = findDimension(data.dataDimensions, "filter", "oug");
  const ouGroupDimension = findDimension(
    data.dataDimensions,
    "dimension",
    "oug"
  );

  let ouGroupFilters = "";

  if (ouGroupFilter) {
    ouGroupFilters =
      globalFilters[ouGroupFilter]
        ?.map((v: string) => `OU_GROUP-${v}`)
        .join(";") ||
      ouGroupFilter
        .split(";")
        .map((v) => `OU_GROUP-${v}`)
        .join(";");
  }

  let ouGroupDimensions = "";
  if (ouGroupDimension) {
    ouGroupDimensions =
      globalFilters[ouGroupDimension]
        ?.map((v: string) => `OU_GROUP-${v}`)
        .join(";") ||
      ouGroupDimension
        .split(";")
        .map((v) => `OU_GROUP-${v}`)
        .join(";");
  }

  let ouLevelFilters = "";
  if (ouLevelFilter) {
    ouLevelFilters =
      globalFilters[ouLevelFilter]
        ?.map((v: string) => `LEVEL-${v}`)
        .join(";") ||
      ouLevelFilter
        .split(";")
        .map((v) => `LEVEL-${v}`)
        .join(";");
  }
  let ouLevelDimensions = "";

  if (ouLevelDimension) {
    ouLevelDimensions =
      globalFilters[ouLevelDimension]
        ?.map((v: string) => `LEVEL-${v}`)
        .join(";") ||
      ouLevelDimension
        .split(";")
        .map((v) => `LEVEL-${v}`)
        .join(";");
  }
  const unitsFilter =
    globalFilters[ouFilters] && globalFilters[ouFilters].length > 0
      ? globalFilters[ouFilters].join(";")
      : ouFilters;

  const unitsDimension =
    globalFilters[ouDimensions] && globalFilters[ouDimensions].length > 0
      ? globalFilters[ouDimensions].join(";")
      : ouDimensions;

  let finalOuFilters = [unitsFilter, ouLevelFilters, ouGroupFilters]
    .filter((v: string) => !!v)
    .join(";");
  let finalOuDimensions = [unitsDimension, ouLevelDimensions, ouGroupDimensions]
    .filter((v: string) => !!v)
    .join(";");

  let finalIFilters =
    globalFilters[iFilters] && globalFilters[iFilters].length > 0
      ? globalFilters[iFilters].join(";")
      : iFilters;
  let finalIDimensions =
    globalFilters[iDimensions] && globalFilters[iDimensions].length > 0
      ? globalFilters[iDimensions].join(";")
      : iDimensions;
  let finalPeFilters =
    globalFilters[peFilters] && globalFilters[peFilters].length > 0
      ? globalFilters[peFilters].join(";")
      : peFilters;
  let finalPeDimensions =
    globalFilters[peDimensions] && globalFilters[peDimensions].length > 0
      ? globalFilters[peDimensions].join(";")
      : peDimensions;
  if (overrides.ou && overrides.ou === "filter") {
    finalOuFilters = finalOuFilters || finalOuDimensions;
    finalOuDimensions = "";
  } else if (overrides.ou && overrides.ou === "dimension") {
    finalOuDimensions = finalOuFilters || finalOuDimensions;
    finalOuFilters = "";
  }
  if (overrides.dx && overrides.dx === "filter") {
    finalIFilters = finalIFilters || finalIDimensions;
    finalIDimensions = "";
  } else if (overrides.dx && overrides.dx === "dimension") {
    finalIDimensions = finalIFilters || finalIDimensions;
    finalIFilters = "";
  }

  if (overrides.pe && overrides.pe === "filter") {
    finalPeFilters = finalPeFilters || finalPeDimensions;
    finalPeDimensions = "";
  } else if (overrides.pe && overrides.pe === "dimension") {
    finalPeDimensions = finalPeFilters || finalPeDimensions;
    finalPeFilters = "";
  }

  if (finalOuFilters && finalOuDimensions) {
    finalOuDimensions = `${finalOuFilters};${finalOuDimensions}`;
    finalOuFilters = "";
  }

  const dd = [
    joinItems(
      [
        [finalOuFilters, "ou"],
        [finalIFilters, "dx"],
        [finalPeFilters, "pe"],
      ],
      "filter"
    ),
    joinItems(
      [
        [finalOuDimensions, "ou"],
        [finalIDimensions, "dx"],
        [finalPeDimensions, "pe"],
      ],
      "dimension"
    ),
  ].join("&");

  return dd;
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
      initial = { ...initial, [`var=${col}`]: val.value };
    }
  });

  return Object.entries(initial)
    .map(([key, value]) => `${key}:${value}`)
    .join("&");
};

const generateDHIS2Query = (
  indicator: IIndicator,
  globalFilters: { [key: string]: any } = {},
  overrides: { [key: string]: string } = {}
) => {
  let queries = {};
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
      currentParams = `?${params}`;
    }
    queries = {
      ...queries,
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
      currentParams = `?${params}`;
    }
    queries = {
      ...queries,
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
  console.log(globalFilters);
  const otherKeys = generateKeys(indicator, globalFilters);
  const overrides = visualization.overrides || {};
  return useQuery<any, Error>(
    [
      "visualizations",
      indicator?.id,
      ...otherKeys,
      ...Object.values(overrides),
    ],
    async () => {
      if (
        indicator &&
        !isEmpty(globalFilters) &&
        dataSource &&
        dataSource.isCurrentDHIS2
      ) {
        const queries = generateDHIS2Query(indicator, globalFilters, overrides);
        const data = await engine.query(queries);
        let processed: any[] = [];
        let metadata = {};
        if (data.numerator && data.denominator) {
          const numerator: any = data.numerator;
          const denominator: any = data.denominator;
          console.log(data);

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
                  return [h.name, currentNum / currentDenValue];
                }
                return [h.name, r[i]];
              })
            );
          });
        } else if (data.numerator) {
          const numerator: any = data.numerator;
          if (numerator && numerator.listGrid) {
            const { headers, rows } = numerator.listGrid;
            if (rows.length > 0) {
              processed = rows.map((row: string[]) => {
                return fromPairs(
                  headers.map((h: any, i: number) => [h.name, row[i]])
                );
              });
            } else {
              processed = [
                fromPairs(headers.map((h: any, i: number) => [h.name, 0])),
              ];
            }
          } else if (numerator) {
            const {
              headers,
              rows,
              metaData: { items },
            } = numerator;
            if (rows.length > 0) {
              processed = rows.map((row: string[]) => {
                return fromPairs(
                  headers.map((h: any, i: number) => [h.name, row[i]])
                );
              });
            } else {
              processed = [
                fromPairs(headers.map((h: any, i: number) => [h.name, 0])),
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
      } else if (dataSource?.type === "API") {
        const { data } = await axios.get(dataSource.authentication.url);
        let numerator: any = undefined;
        let denominator: any = undefined;

        if (indicator?.numerator?.accessor) {
          numerator = data[indicator?.numerator?.accessor];
        } else if (indicator?.numerator?.name) {
          numerator = data;
        }

        if (indicator?.denominator?.accessor) {
          denominator = data[indicator?.denominator?.accessor];
        } else if (indicator?.denominator?.name) {
          denominator = data;
        }

        if (numerator && denominator) {
          console.log("Are we here some how");
        } else if (numerator) {
          updateVisualizationData({
            visualizationId: visualization.id,
            data: numerator,
          });
        }
      }
      return true;
    },
    { refetchInterval: currentInterval }
  );
};

export const useMaps = (levels: string[], parents: string[]) => {
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

  return useQuery<any, Error>(["maps", ...levels, ...parents], async () => {
    const { geojson, ...otherLevels }: any = await engine.query(query);
    const mapCenter = center(geojson).geometry.coordinates;
    const organisationUnits = Object.values(otherLevels).flatMap(
      ({ organisationUnits }: any) => organisationUnits
    );
    return {
      geojson,
      mapCenter,
      organisationUnits,
    };
  });
};
