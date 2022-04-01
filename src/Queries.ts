import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import { setCurrentDashboard, loadDefaults, addPagination } from "./Events";

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

export const useInitials = () => {
  const engine = useDataEngine();
  const ouQuery = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name]",
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
        organisationUnits,
        dataSources,
        settings,
      });
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
    return true;
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
        elements: {
          sqlViews,
        },
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
