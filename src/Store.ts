import { domain } from "./Domain";
import { loadDefaults } from "./Events";
import { Store } from "./interfaces";
import {
  setSelectedUnits,
  setSublevel,
  setSublevels,
  setUserUnits,

} from "./Events";

export const $store = domain
  .createStore<Store>({
    categories: [],
    sections: [],
    dashboards: [],
    visualizations: [],
    category: "",
    section: "",
    dashboard: "",
    visualization: "",
    organisationUnits: [],
  })
  .on(
    loadDefaults,
    (
      state,
      { dashboards, visualizations, sections, categories, organisationUnits }
    ) => {
      return {
        ...state,
        dashboards,
        visualizations,
        sections,
        categories,
        organisationUnits,
      };
    }
  )
  
  ;
