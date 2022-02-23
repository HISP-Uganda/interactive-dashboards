import { useQuery } from "react-query";
import { useDataEngine } from "@dhis2/app-runtime";
import { addDashboard, loadDefaults } from "./Events";
import { fromPairs } from "lodash";
import { Dashboard, Section } from "./interfaces";

export const useInitials = () => {
  const engine = useDataEngine();
  const query = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name]",
      },
    },
    dashboards: {
      resource: "dataStore/i-dashboards",
    },
    visualizations: {
      resource: "dataStore/i-visualizations",
    },
    sections: {
      resource: "dataStore/i-sections",
    },
    categories: {
      resource: "dataStore/i-categories",
    },
  };
  return useQuery<any, Error>(["initial"], async () => {
    const {
      me: { organisationUnits },
      dashboards,
      visualizations,
      sections,
      categories,
    }: any = await engine.query(query);
    loadDefaults({
      dashboards,
      visualizations,
      categories,
      organisationUnits,
    });
    console.log(dashboards);
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
  return useQuery<any, Error>(["namespaces", namespace], async () => {
    const { namespaceKeys }: any = await engine.query(namespaceQuery);
    const query: any = fromPairs(
      namespaceKeys.map((n: string) => [
        n,
        {
          resource: `dataStore/${namespace}/${n}`,
        },
      ])
    );
    return await engine.query(query);
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
    addDashboard(dashboard);
    return true;
  });
};
