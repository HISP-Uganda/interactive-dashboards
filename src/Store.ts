import { domain } from "./Domain";
import {
  setCurrentSection,
  addCategory,
  setCurrentDashboard,
  addDataSource,
  addSection,
  deleteSection,
  loadDefaults,
  toggleDashboard,
  changeVisualizationDataSource,
  changeVisualizationType,
  setCurrentVisualization,
} from "./Events";
import { ISection, IStore, IVisualization } from "./interfaces";
import { generateUid } from "./utils/uid";

export const $store = domain
  .createStore<IStore>({
    categories: [],
    dashboards: [],
    visualizations: [],
    settings: [],
    dashboard: { id: generateUid(), sections: [], published: false },
    category: "",
    section: undefined,
    visualization: undefined,
    organisationUnits: [],
    hasDashboards: false,
    hasDefaultDashboard: false,
    dataSources: [],
  })
  .on(
    loadDefaults,
    (state, { dashboards, categories, organisationUnits, dataSources }) => {
      return {
        ...state,
        dashboards,
        categories,
        organisationUnits,
        dataSources,
      };
    }
  )
  .on(addCategory, (state, category) => {
    return {
      ...state,
      categories: [...state.categories, category],
    };
  })
  .on(addDataSource, (state, dataSource) => {
    return {
      ...state,
      dataSources: [...state.dataSources, dataSource],
    };
  })
  .on(setCurrentDashboard, (state, dashboard) => {
    return {
      ...state,
      dashboard: dashboard,
    };
  })
  .on(addSection, (state) => {
    const id = generateUid();
    const layout = {
      i: id,
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    };
    const currentSection: ISection = {
      layout: { md: layout },
      name: "test",
      visualizations: [],
      id,
    };
    return {
      ...state,
      section: currentSection,
      dashboard: {
        ...state.dashboard,
        sections: [...state.dashboard.sections, currentSection],
      },
    };
  })
  .on(deleteSection, (state, section) => {
    if (state.dashboard) {
      const sections = state.dashboard.sections.filter((s) => s.id !== section);
      return {
        ...state,
        dashboard: { ...state.dashboard, sections },
        section: undefined,
      };
    }
  })
  .on(setCurrentSection, (state, section) => {
    return { ...state, section };
  })
  .on(toggleDashboard, (state, published) => {
    if (state.dashboard) {
      return { ...state, dashboard: { ...state.dashboard, published } };
    }
  })
  .on(setCurrentVisualization, (state, visualization) => {
    return {
      ...state,
      visualization,
    };
  })
  .on(changeVisualizationType, (state, type) => {
    if (state.visualization) {
      return {
        ...state,
        visualization: {
          ...state.visualization,
          type,
        },
      };
    }
  })
  .on(changeVisualizationDataSource, (state, dataSource) => {
    if (state.visualization) {
      return {
        ...state,
        visualization: {
          ...state.visualization,
          dataSource,
        },
      };
    }
  });

export const $layout = $store.map((state) => {
  const md = state.dashboard?.sections.map((s) => s.layout.md);
  return { md };
});
