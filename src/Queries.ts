import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import { addDashboard, loadDefaults } from "./Events";

export const useInitials = () => {
  const engine = useDataEngine();
  const query = {
    dashboards: {
      resource: "dataStore/i-dashboards",
    },
    // visualizations: {
    //   resource: "dataStore/i-visualizations",
    // },
    // sections: {
    //   resource: "dataStore/i-sections",
    // },
    categories: {
      resource: "dataStore/i-categories",
    },
    // settings: {
    //   resource: "dataStore/i-dashboard-settings/settings",
    // },
    dataSources: {
      resource: "dataStore/i-data-sources",
    },
  };

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
      const {
        dashboards,
        categories,
        dataSources,
      }: any = await engine.query(query);

      // if (settings && settings.default) {
      //   const { dashboard }: any = await engine.query({
      //     dashboard: {
      //       resource: `dataStore/i-dashboards/${settings.default}`,
      //     },
      //   });
      //   addDashboard(dashboard);
      // }
      loadDefaults({
        dashboards,
        categories,
        organisationUnits,
        dataSources,
      });
    } catch (error) {
      loadDefaults({
        dashboards: [],
        categories: [],
        organisationUnits,
        dataSources: [],
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
  return useQuery<any, Error>(["namespaces", namespace], async () => {
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
    addDashboard(dashboard);
    return true;
  });
};
