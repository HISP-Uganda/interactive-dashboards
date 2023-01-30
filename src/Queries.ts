import { useDataEngine } from "@dhis2/app-runtime";
import axios, { AxiosRequestConfig } from "axios";
import { fromPairs, isEmpty, max, min, uniq } from "lodash";
import { evaluate } from "mathjs";
import { useQuery } from "@tanstack/react-query";
import {
  addPagination,
  changeAdministration,
  changeSelectedCategory,
  changeSelectedDashboard,
  onChangeOrganisations,
  setAvailableCategories,
  setAvailableCategoryOptionCombos,
  setCategories,
  setCategory,
  setCurrentDashboard,
  setCurrentPage,
  setDataSets,
  setDataSource,
  setDataSources,
  setDefaultDashboard,
  setIndicator,
  setInstanceBaseUrl,
  setMaxLevel,
  setMinSublevel,
  setShowFooter,
  setShowSider,
  setSystemId,
  setSystemName,
  setTargetCategoryOptionCombos,
  setVisualizationQueries,
  updateVisualizationData,
  updateVisualizationMetadata,
  setOrganisations,
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
  Option,
  Threshold,
} from "./interfaces";
import {
  createCategory,
  createDashboard,
  createDataSource,
  createIndicator,
} from "./Store";
import { getSearchParams, processMap } from "./utils/utils";
import { db } from "./db";

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
    return {};
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

// export const useOrganisationUnits = () => {
//   const engine = useDataEngine();
//   const ouQuery = {
//     me: {
//       resource: "me.json",
//       params: {
//         fields: "organisationUnits[id,name,level,leaf]",
//       },
//     },
//     levels: {
//       resource: "organisationUnitLevels.json",
//       params: {
//         fields: "id,level~rename(value),name~rename(label)",
//       },
//     },
//     groups: {
//       resource: "organisationUnitGroups.json",
//       params: {
//         fields: "id~rename(value),name~rename(label)",
//       },
//     },
//   };

//   return useQuery<boolean, Error>(["organisation-units"], async () => {
//     const organisations = await db.organisations.toArray();
//     const groups = await db.groups.toArray();
//     const levels = await db.levels.toArray();

//     if (
//       organisations.length === 0 ||
//       groups.length === 0 ||
//       levels.length === 0
//     ) {
//       const {
//         me: { organisationUnits },
//         levels: { organisationUnitLevels },
//         groups: { organisationUnitGroups },
//       }: any = await engine.query(ouQuery);
//       const units: DataNode[] = organisationUnits.map((o: any) => {
//         return {
//           id: o.id,
//           pId: "",
//           key: o.id,
//           title: o.name,
//           level: o.level,
//           isLeaf: o.leaf,
//         };
//       });
//       await db.organisations.bulkPut(units);
//       await db.groups.bulkPut(organisationUnitGroups);
//       await db.levels.bulkPut(
//         organisationUnitLevels.map((x: any) => {
//           return { ...x, value: String(x.value) };
//         })
//       );
//     }

//     return true;
// return {
//   units,
// levels: ,
//   groups: organisationUnitGroups,
// };
//   });
// };

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
  };
  return useQuery<any, Error>(["initial"], async ({ signal }) => {
    const organisations = await db.organisations.toArray();
    const groups = await db.groups.toArray();
    const levels = await db.levels.toArray();
    // const dataSets = await db.dataSets.toArray();

    const systemQuery = {
      systemInfo: {
        resource: "system/info",
      },
    };

    const {
      systemInfo: { systemId, systemName, instanceBaseUrl },
    }: any = await engine.query(systemQuery);

    if (
      organisations.length === 0 ||
      groups.length === 0 ||
      levels.length === 0
    ) {
      const {
        me: { organisationUnits, authorities },
        levels: { organisationUnitLevels },
        dataSets: { dataSets },
      }: any = await engine.query(ouQuery);
      setSystemId(systemId);
      setSystemName(systemName);
      // setDataSets(dataSets);
      setInstanceBaseUrl(instanceBaseUrl);
      const isAdmin = authorities.indexOf("IDVT_ADMINISTRATION") !== -1;
      changeAdministration(isAdmin);
      const facilities: string[] = organisationUnits.map(
        (unit: any) => unit.id
      );
      setOrganisations(facilities);
      const maxLevel = organisationUnitLevels[0].level;
      setMaxLevel(maxLevel);
      const levels = organisationUnits.map(({ value }: any) => Number(value));
      const minSublevel: number | null | undefined = max(levels);
      if (minSublevel && minSublevel + 1 <= maxLevel) {
        setMinSublevel(minSublevel + 1);
      } else {
        setMinSublevel(maxLevel);
      }
      const availableUnits = organisationUnits.map((unit: any) => {
        return {
          id: unit.id,
          pId: unit.pId || "",
          value: unit.id,
          title: unit.name,
          isLeaf: unit.leaf,
        };
      });
      if (organisations && organisations.length === 0) {
        await db.organisations.bulkPut(availableUnits);
      }
      // await db.dataSets.bulkPut(dataSets);
    }
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
    return true;
  });
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
  return useQuery<void, Error>(["i-data-sources", id], async ({ signal }) => {
    const dataSource: IDataSource =
      (await getOneRecord("i-data-sources", id, signal)) ||
      createDataSource(id);
    setDataSource(dataSource);
  });
};

export const useDashboards = (systemId: string) => {
  return useQuery<IDashboard[], Error>(["i-dashboards"], async ({ signal }) => {
    try {
      return await getIndex("i-dashboards", systemId, [], signal);
    } catch (error) {
      console.error(error);
      return [];
    }
  });
};

export const useDashboard = (
  id: string,
  systemId: string,
  refresh: boolean = true
) => {
  const engine = useDataEngine();
  return useQuery<boolean, Error>(["i-dashboards", id], async ({ signal }) => {
    if (refresh) {
      let dashboard: IDashboard | null = await getOneRecord(
        "i-dashboards",
        id,
        signal
      );
      if (!dashboard) {
        dashboard = createDashboard(id);
      } else if (dashboard.targetCategoryCombo) {
        const {
          combo: { categoryOptionCombos },
        }: any = await engine.query({
          combo: {
            resource: `categoryCombos/${dashboard.targetCategoryCombo}`,
            params: {
              fields:
                "categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]",
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
      const categories = await getIndex("i-categories", systemId, [], signal);
      setCategories(categories);
      setDataSources(dataSources);
      setCurrentDashboard(dashboard);
      changeSelectedDashboard(dashboard.id);
      changeSelectedCategory(dashboard.category || "");
      setVisualizationQueries(queries);
    }
    return true;
  });
};

export const useCategories = (systemId: string) => {
  return useQuery<ICategory[], Error>(["i-categories"], async ({ signal }) => {
    try {
      return await getIndex("i-categories", systemId, [], signal);
    } catch (error) {
      console.error(error);
      return [];
    }
  });
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
        return await getIndex("i-visualization-queries", systemId, [], signal);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  );
};

export const useVisualizationDatum = (id: string, systemId: string) => {
  return useQuery<void, Error>(
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
        if (!indicator) {
          indicator = createIndicator(id);
        }
        setDataSources(dataSources);
        setIndicator(indicator);
      } catch (error) {
        console.error(error);
      }
    }
  );
};

export const useDataSet = (dataSetId: string) => {
  console.log(dataSetId);
  const engine = useDataEngine();
  const namespaceQuery = {
    dataSet: {
      resource: `dataSets/${dataSetId}`,
      params: {
        fields:
          "categoryCombo[categoryOptionCombos[id,name,categoryOptions],categories[id,name,categoryOptions[id~rename(value),name~rename(label)]]]",
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
            let currentValue = String(val.value).replaceAll(
              globalId,
              globalValue.join("-")
            );
            const calcIndex = currentValue.indexOf("calc");
            if (calcIndex !== -1) {
              const original = currentValue.slice(calcIndex);
              const computed = evaluate(original.replaceAll("calc", ""));
              currentValue = currentValue.replaceAll(original, computed);
            }
            initial = {
              ...initial,
              [`var=${col}`]: currentValue,
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
  const dhis2Indicators = indicators.flatMap((indicator) => {
    const ds = dataSources.find(
      (dataSource) =>
        dataSource.id === indicator.dataSource && dataSource.type === "DHIS2"
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
                  `${indicator.realDataSource?.authentication.url || ""}/api/${
                    query.numerator
                  }`,
                  {
                    auth: {
                      username:
                        indicator.realDataSource?.authentication.username || "",
                      password:
                        indicator.realDataSource?.authentication.password || "",
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
                  `${indicator.realDataSource?.authentication.url || ""}/api/${
                    query.denominator
                  }`,
                  {
                    auth: {
                      username:
                        indicator.realDataSource?.authentication.username || "",
                      password:
                        indicator.realDataSource?.authentication.password || "",
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
            console.log("This is wrong");
            const [{ data: num }, { data: den }] = await Promise.all(
              allQueries
            );
            numerator = num;
            denominator = den;
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
              ...numerators.map((numerator: { [key: string]: string }) => {
                const { value: v1, total: t1, ...others } = numerator;
                const columns = Object.values(others).sort().join("");

                const denominator = denominators.find(
                  (row: { [key: string]: string }) => {
                    const { value, total, ...someOthers } = row;
                    return (
                      columns === Object.values(someOthers).sort().join("")
                    );
                  }
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
                          evaluate(`${row[i]}${indicator.factor}`),
                        ];
                      }
                      return [h.name, row[i]];
                    })
                  );
                });

                if (
                  ["AHxO7yowduX", "a19pSPoyUl9"].indexOf(visualization.id) !==
                    -1 &&
                  ["ejqSEwfG07O", "FOgNEFzg210"].indexOf(indicator.id) !== -1
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
          return { title: name, key: code, id: code, pId: "", value: code };
        })
      );
    }
    return true;
  });
};
