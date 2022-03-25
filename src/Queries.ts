import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import { setCurrentDashboard, loadDefaults } from "./Events";

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
    setCurrentDashboard(dashboard);
    return true;
  });
};
