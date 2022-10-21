import { useDataEngine } from "@dhis2/app-runtime";
import { center, bbox } from "@turf/turf";
import type { DataNode } from "antd/lib/tree";
import axios, { AxiosRequestConfig } from "axios";
import { fromPairs, isEmpty, min, uniq } from "lodash";
import { evaluate, map } from "mathjs";
import { useQuery } from "react-query";
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
  setSystemId,
  setSystemName,
  setVisualizationQueries,
  updateVisualizationData,
  updateVisualizationMetadata,
} from "./Events";
import {
  IDashboard,
  IData,
  IDataSource,
  IDimension,
  IExpressions,
  IIndicator,
  IVisualization,
  Option,
  Threshold,
} from "./interfaces";
import { getSearchParams, traverse } from "./utils/utils";

export const api = axios.create({
  baseURL: "https://services.dhis2.hispuganda.org/",
  // baseURL: "http://localhost:3001/",
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

const getIndex = async (
  namespace: string,
  systemId: string,
  otherQueries: any[] = []
) => {
  let must: any[] = [
    {
      term: { "systemId.keyword": systemId },
    },
    ...otherQueries,
  ];
  let {
    data: {
      hits: { hits },
    },
  }: any = await api.post("wal/search", {
    index: namespace,
    size: 1000,
    query: {
      bool: {
        must,
      },
    },
  });
  return hits;
};

const loadResource = async (namespace: string, systemId: string) => {
  const hits = await getIndex(namespace, systemId);
  return hits.map(({ _source }: any) => _source);
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
        fields: "id,level~rename(value),name~rename(label)",
      },
    },
    groups: {
      resource: "organisationUnitGroups.json",
      params: {
        fields: "id~rename(value),name~rename(label)",
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

    return {
      units,
      levels: organisationUnitLevels.map((x: any) => {
        return { ...x, value: String(x.value) };
      }),
      groups: organisationUnitGroups,
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
    systemInfo: {
      resource: "system/info",
    },
  };
  return useQuery<any, Error>(["initial"], async () => {
    try {
      const {
        systemInfo: { systemId, systemName },
        me: { organisationUnits, authorities },
        dataSets: { dataSets },
      }: any = await engine.query(ouQuery);
      setSystemId(systemId);
      setSystemName(systemName);
      setDataSets(dataSets);
      const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;
      changeAdministration(isAdmin);
      const facilities: React.Key[] = organisationUnits.map(
        (unit: any) => unit.id
      );
      const minLevel: number | null | undefined = min(
        organisationUnits.map(({ level }: any) => Number(level))
      );
      onChangeOrganisations({
        levels: [minLevel === 1 ? "3" : `${minLevel ? minLevel + 1 : 4}`],
        organisations: facilities,
        groups: [],
        expandedKeys: [],
        checkedKeys: facilities,
      });
      const dashboards = await loadResource("i-dashboards", systemId);
      const categories = await loadResource("i-categories", systemId);
      const dataSources = await loadResource("i-data-sources", systemId);
      const visualizationQueries = await loadResource(
        "i-visualization-queries",
        systemId
      );
      const settings = await loadResource("i-dashboard-settings", systemId);
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
    } catch (error) {
      console.error(error);
    }
    return true;
  });
};

export const useDataSources = (systemId: string) => {
  return useQuery<boolean, Error>(["data-sources"], async () => {
    try {
      const hits = await getIndex("i-data-sources", systemId);
      const dataSources = hits.map(({ _source }: any) => _source);
      setDataSources(dataSources);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useDashboards = (systemId: string) => {
  return useQuery<boolean, Error>(["dashboards"], async () => {
    try {
      const hits = await getIndex("i-dashboards", systemId);
      const dashboards = hits.map(({ _source }: any) => _source);
      setDashboards(dashboards);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useCategories = (systemId: string) => {
  return useQuery<boolean, Error>(["categories"], async () => {
    try {
      const hits = await getIndex("i-categories", systemId);
      const categories = hits.map(({ _source }: any) => _source);
      setCategories(categories);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });
};

export const useVisualizationData = (systemId: string) => {
  return useQuery<boolean, Error>(["visualization-queries"], async () => {
    try {
      const hits = await getIndex("i-visualization-queries", systemId);
      const visualizationQueries = hits.map(({ _source }: any) => _source);
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
        ({ id, categoryOptions }: any, index: number) => [
          id,
          index === 0 ? [categoryOptions[1]] : categoryOptions,
        ]
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
  q = "",
  selectedProgramIndicators: string[] = []
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
        Object.entries(globalFilters).forEach(([globalId, globalValue]) => {
          if (String(val.value).indexOf(globalId) !== -1) {
            initial = {
              ...initial,
              [`var=${col}`]: String(val.value).replaceAll(
                globalId,
                globalValue.join("-")
              ),
            };
          }
        });
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
    let query = {};
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
        currentParams = `?${params}&paging=false`;
      }
      query = {
        ...query,
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
        query = {
          ...query,
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
        currentParams = `?${params}&paging=false`;
      }
      query = {
        ...query,
        denominator: {
          resource: `sqlViews/${
            Object.keys(indicator.denominator.dataDimensions)[0]
          }/data.json${currentParams}`,
        },
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
  const dhis2Indicators = indicators.filter((indicator) => {
    const ds = dataSources.find(
      (dataSource) => dataSource.id === indicator.dataSource
    );
    return ds?.type === "DHIS2";
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
    async () => {
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
          const data = await engine.query(query);
          let metadata = {};
          if (data.numerator && data.denominator) {
            const numerator: any = data.numerator;
            const denominator: any = data.denominator;
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
              ...numerators.map((numerator: { [key: string]: string }) => {
                const columns = Object.keys(numerator).sort().join("");
                const denominator = denominators.find(
                  (row: { [key: string]: string }) =>
                    columns === Object.keys(row).sort().join("")
                );

                if (denominator) {
                  const { value: v1, total: t1 } = numerator;
                  const { value: v2, total: t2 } = denominator;

                  if (indicator.custom && v1 && v2) {
                    const expression = indicator.factor
                      .replaceAll("x", v1)
                      .replaceAll("y", v2);
                    return {
                      ...numerator,
                      value: evaluate(expression),
                    };
                  }

                  if (v1 && v2 && indicator.factor !== "1") {
                    const computed = Number(v1) / Number(v2);
                    return {
                      ...numerator,
                      value: evaluate(`${computed}${indicator.factor}`),
                    };
                  }

                  if (v1 && v2) {
                    const computed = Number(v1) / Number(v2);
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

                  if (t1 && t2 && indicator.factor !== "1") {
                    const computed = Number(t1) / Number(t2);
                    return {
                      ...numerator,
                      value: evaluate(`${computed}${indicator.factor}`),
                    };
                  }
                  if (t1 && t2) {
                    const computed = Number(t1) / Number(t2);
                    return {
                      ...numerator,
                      value: computed,
                    };
                  }
                }
                return { ...numerator, value: 0 };
              }),
            ];
          } else if (data.numerator) {
            const numerator: any = data.numerator;
            if (numerator && numerator.listGrid) {
              const { headers, rows } = numerator.listGrid;
              if (rows.length > 0) {
                let foundRows = rows.map((row: string[]) => {
                  return fromPairs(
                    headers.map((h: any, i: number) => {
                      if (indicator.factor !== "1") {
                        return [
                          h.name,
                          evaluate(`${row[i]}${indicator.factor}`),
                        ];
                      }
                      return [h.name, row[i]];
                    })
                  );
                });

                if (
                  visualization.id === "AHxO7yowduX" &&
                  indicator.id === "ejqSEwfG07O"
                ) {
                  const firstValue = foundRows[0].value || foundRows[0].total;

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
                      value: Number(Number(firstValue / 5).toFixed(0)),
                    };
                  });
                }
                processed = [...processed, ...foundRows];
              } else {
                processed = [
                  ...processed,
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
                processed = [
                  ...processed,
                  ...rows.map((row: string[]) => {
                    return fromPairs(
                      headers.map((h: any, i: number) => [h.name, row[i]])
                    );
                  }),
                ];
              } else {
                processed = [
                  ...processed,
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
  thresholds: Threshold[]
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
  return useQuery<any, Error>(["maps", ...levels, ...parents], async () => {
    const { geojson, ...otherLevels }: any = await engine.query(query);
    const mapCenter = center(geojson).geometry.coordinates;
    const bounds = bbox(geojson);
    const organisationUnits = Object.values(otherLevels).flatMap(
      ({ organisationUnits }: any) => organisationUnits
    );
    const { features, ...rest } = geojson;
    const processedData = fromPairs(
      data.map((d) => {
        const value = d.value || d.total;
        const id = d.c || d.ou;
        return [id, value];
      })
    );

    const processedFeatures = features.map(
      ({ id, properties, ...others }: any) => {
        let value = processedData[id];
        const colorSearch = thresholds.find(({ max, min }: any) => {
          if (max && min) {
            return Number(value) >= Number(min) && Number(value) < Number(max);
          } else if (min) {
            return Number(value) >= Number(min);
          } else if (max) {
            return Number(value) <= Number(max);
          }
        });
        let color = "white";

        if (value && colorSearch) {
          color = colorSearch.color;
        } else if (value && thresholds.length > 0) {
          color = thresholds[0].color;
        }

        return {
          id,
          ...others,
          properties: {
            ...properties,
            value: value
              ? Intl.NumberFormat("en-US", {
                  style: "percent",
                  notation: "standard",
                  maximumFractionDigits: 2,
                }).format(value / 100)
              : "No Data",
            color,
          },
        };
      }
    );
    return {
      geojson: { ...rest, features: processedFeatures },
      mapCenter,
      organisationUnits,
      bounds,
    };
  });
};

export const saveDocument = async (
  index: string,
  systemId: string,
  document: { [key: string]: any }
) => {
  const { data } = await api.post(`wal/bulk?index=${index}`, {
    data: [{ ...document, systemId }],
  });
  return data;
};
