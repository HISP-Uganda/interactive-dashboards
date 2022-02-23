import { domain } from "./Domain";
import {
  activateSection,
  addCategory,
  addDashboard,
  addSection,
  loadDefaults
} from "./Events";
import { Section, Store } from "./interfaces";
import { generateUid } from "./utils/uid";

export const $store = domain
  .createStore<Store>({
    categories: [],
    dashboards: [],
    visualizations: [],
    dashboard: { id: generateUid(), sections: [] },
    category: "",
    section: "",
    visualization: "",
    organisationUnits: [],
  })
  .on(
    loadDefaults,
    (state, { dashboards, visualizations, categories, organisationUnits }) => {
      return {
        ...state,
        dashboards,
        visualizations,
        categories,
        organisationUnits,
      };
    }
  )
  .on(addCategory, (state, category) => {
    return {
      ...state,
      categories: [...state.categories, category],
    };
  })
  .on(addDashboard, (state, dashboard) => {
    return {
      ...state,
      dashboard,
    };
  })
  .on(addSection, (state) => {
    const id = generateUid();
    const layout = {
      i: id,
      x: 0,
      y: Infinity,
      w: 2,
      h: 2,
    };

    const currentSection: Section = {
      layout: { md: layout },
      name: "test",
      id,
    };
    return {
      ...state,
      section: id,
      dashboard: {
        ...state.dashboard,
        sections: [...state.dashboard.sections, currentSection],
      },
    };
  })
  .on(activateSection, (state, section) => {
    return { ...state, section };
  });

export const $layout = $store.map((state) => {
  const md = state.dashboard.sections.map((s) => {
    return s.layout.md;
  });

  return { md };
});
