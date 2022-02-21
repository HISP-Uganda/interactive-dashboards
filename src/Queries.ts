import { useQuery } from "react-query";
import { useDataEngine } from "@dhis2/app-runtime";
import { loadDefaults } from "./Events";

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
      resource: "dataStore/interactive-dashboard/dashboards",
    },
    visualizations: {
      resource: "dataStore/interactive-dashboard/visualizations",
    },
    sections: {
      resource: "dataStore/interactive-dashboard/sections",
    },
    categories: {
      resource: "dataStore/interactive-dashboard/categories",
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
      sections,
      categories,
      organisationUnits,
    });
    return true;
  });
};
