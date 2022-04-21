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
  addPagination,
  changeDenominatorDataSource,
  changeNumeratorDataSource,
  addNumeratorExpression,
  addDenominatorExpression,
  changeIndicatorAttribute,
  changeDenominatorExpressionValue,
  changeNumeratorExpressionValue,
  changeDenominatorAttribute,
  changeNumeratorAttribute,
  changeNumeratorDimension,
  changeDenominatorDimension,
} from "./Events";
import {
  IExpression,
  IIndicator,
  ISection,
  IStore,
  IVisualization,
} from "./interfaces";
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
    paginations: { totalDataElements: 0, totalSQLViews: 0, totalIndicators: 0 },
    indicator: {
      id: generateUid(),
      numerator: {
        id: generateUid(),
        dataSource: undefined,
        type: "ANALYTICS",
      },
      denominator: {
        id: generateUid(),
        dataSource: undefined,
        type: "ANALYTICS",
      },
      factor: "1",
    },
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
  })
  .on(addPagination, (state, pagination) => {
    return {
      ...state,
      paginations: { ...state.paginations, ...pagination },
    };
  });

export const $indicator = domain
  .createStore<IIndicator>({
    id: generateUid(),
    numerator: {
      id: generateUid(),
      dataSource: undefined,
      type: "ANALYTICS",
      dataDimensions: {},
    },
    denominator: {
      id: generateUid(),
      dataSource: undefined,
      type: "ANALYTICS",
      dataDimensions: {},
    },
    name: "",
    description: "",
    factor: "1",
  })
  .on(changeIndicatorAttribute, (state, { attribute, value }) => {
    return { ...state, [attribute]: value };
  })
  .on(changeDenominatorExpressionValue, (state, { attribute, value, id }) => {
    const expressions = state.denominator.expressions?.map((ex) => {
      if (ex.id === id) {
        return { ...ex, [attribute]: value };
      }
      return ex;
    });
    return {
      ...state,
      denominator: { ...state.denominator, expressions },
    };
  })
  .on(changeNumeratorExpressionValue, (state, { attribute, value, id }) => {
    const expressions = state.numerator.expressions?.map((ex) => {
      if (ex.id === id) {
        return { ...ex, [attribute]: value };
      }
      return ex;
    });

    return {
      ...state,
      numerator: { ...state.numerator, expressions },
    };
  })
  .on(addNumeratorExpression, (state, expression) => {
    let expressions: IExpression[] = [];

    if (state.numerator.expressions) {
      expressions = state.numerator.expressions;
    }
    return {
      ...state,
      numerator: {
        ...state.numerator,
        expressions: [...expressions, expression],
      },
    };
  })
  .on(addDenominatorExpression, (state, expression) => {
    let expressions: IExpression[] = [];

    if (state.denominator.expressions) {
      expressions = state.denominator.expressions;
    }
    return {
      ...state,
      denominator: {
        ...state.denominator,
        expressions: [...expressions, expression],
      },
    };
  })
  .on(changeDenominatorAttribute, (state, { attribute, value }) => {
    return {
      ...state,
      denominator: {
        ...state.denominator,
        [attribute]: value,
      },
    };
  })
  .on(changeNumeratorAttribute, (state, { attribute, value }) => {
    return {
      ...state,
      numerator: {
        ...state.numerator,
        [attribute]: value,
      },
    };
  })
  .on(changeDenominatorDataSource, (state, dataSource) => {
    return {
      ...state,
      denominator: { ...state.denominator, dataSource },
    };
  })
  .on(changeNumeratorDataSource, (state, dataSource) => {
    return {
      ...state,
      numerator: { ...state.numerator, dataSource },
    };
  })
  .on(changeNumeratorDimension, (state, { id, what, type }) => {
    return {
      ...state,
      numerator: {
        ...state.numerator,
        dataDimensions: {
          ...state.numerator.dataDimensions,
          [id]: { what, type },
        },
      },
    };
  })
  .on(changeDenominatorDimension, (state, { id, what, type }) => {
    return {
      ...state,
      denominator: {
        ...state.denominator,
        dataDimensions: {
          ...state.denominator.dataDimensions,
          [id]: { what, type },
        },
      },
    };
  });

export const $layout = $store.map((state) => {
  const md = state.dashboard?.sections.map((s) => s.layout.md);
  return { md };
});
