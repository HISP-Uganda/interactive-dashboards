import { combine, forward, sample } from "effector";
import { domain } from "./Domain";
import {
  setCurrentSection,
  addCategory,
  setCurrentDashboard,
  setDataSources,
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
  changeDataSource,
  changeUseIndicators,
  changeVisualizationQueries,
  addVisualization2Section,
  changeDefaults,
  changeLayouts,
  increment,
  toggle,
  setShowSider,
  setDataSource,
} from "./Events";
import {
  ICategory,
  IDashboard,
  IDataSource,
  IExpression,
  IIndicator,
  ISection,
  IStore,
  IVisualization,
  Option,
} from "./interfaces";
import { generateUid } from "./utils/uid";

export const createSection = (): ISection => {
  const id = generateUid();
  return {
    i: id,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    title: "test",
    visualizations: [],
  };
};

export const createDataSource = (): IDataSource => {
  return {
    id: generateUid(),
    type: "DHIS2",
    authentication: {
      url: "",
      username: "",
      password: "",
    },
    isCurrentDHIS2: true,
  };
};

export const $store = domain
  .createStore<IStore>({
    categories: [],
    dashboards: [],
    visualizations: [],
    settings: [],
    organisationUnits: [],
    hasDashboards: false,
    hasDefaultDashboard: false,
    showSider: true,
    dataSources: [],
    paginations: {
      totalDataElements: 0,
      totalSQLViews: 0,
      totalIndicators: 0,
      totalProgramIndicators: 0,
      totalOrganisationUnitLevels: 0,
      totalOrganisationUnitGroups: 0,
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
  .on(setShowSider, (state, showSider) => {
    return { ...state, showSider };
  })
  // .on(addDataSource, (state, dataSource) => {
  //   return {
  //     ...state,
  //     dataSources: [...state.dataSources, dataSource],
  //   };
  // })
  // .on(setCurrentDashboard, (state, dashboard) => {
  //   return {
  //     ...state,
  //     dashboard: dashboard,
  //   };
  // })
  // .on(addSection, (state) => {
  //   const id = generateUid();
  //   const layout = {
  //     i: id,
  //     x: 0,
  //     y: 0,
  //     w: 2,
  //     h: 2,
  //   };
  //   const currentSection: ISection = {
  //     layout: { md: layout },
  //     name: "test",
  //     visualizations: [],
  //     id,
  //   };
  //   return {
  //     ...state,
  //     section: currentSection,
  //     dashboard: {
  //       ...state.dashboard,
  //       sections: [...state.dashboard.sections, currentSection],
  //     },
  //   };
  // })
  // .on(deleteSection, (state, section) => {
  //   if (state.dashboard) {
  //     const sections = state.dashboard.sections.filter((s) => s.id !== section);
  //     return {
  //       ...state,
  //       dashboard: { ...state.dashboard, sections },
  //       section: undefined,
  //     };
  //   }
  // })
  // .on(setCurrentSection, (state, section) => {
  //   return { ...state, section };
  // })
  // .on(toggleDashboard, (state, published) => {
  //   return { ...state, dashboard: { ...state.dashboard, published } };
  // })
  .on(setCurrentVisualization, (state, visualization) => {
    return {
      ...state,
      visualization,
    };
  })
  // .on(changeVisualizationType, (state, type) => {
  //   if (state.visualization) {
  //     return {
  //       ...state,
  //       visualization: {
  //         ...state.visualization,
  //         type,
  //       },
  //     };
  //   }
  // })
  // .on(changeVisualizationDataSource, (state, dataSource) => {
  //   if (state.visualization) {
  //     return {
  //       ...state,
  //       visualization: {
  //         ...state.visualization,
  //         dataSource,
  //       },
  //     };
  //   }
  // })
  .on(addPagination, (state, pagination) => {
    return {
      ...state,
      paginations: { ...state.paginations, ...pagination },
    };
  });
// .on(changeVisualizationQueries, (state, indicators) => {
//   let visualization = state.visualization;
//   if (visualization) {
//     visualization = { ...visualization, indicators };
//   }
//   return {
//     ...state,
//     visualization,
//   };
// });

export const $dataSource = domain
  .createStore<IDataSource>({
    id: generateUid(),
    type: "DHIS2",
    authentication: {
      url: "",
      username: "",
      password: "",
    },
    isCurrentDHIS2: true,
  })
  .on(setDataSource, (_, dataSource) => dataSource);

export const $category = domain.createStore<ICategory>({
  id: generateUid(),
  name: "",
});

export const $dataSources = domain
  .createStore<IDataSource[]>([])
  .on(setDataSources, (_, dataSources) => dataSources);
export const $indicators = domain.createStore<IIndicator[]>([]);

export const $dashboard = domain
  .createStore<IDashboard>({
    id: generateUid(),
    sections: [],
    published: false,
    layouts: {},
    itemHeight: 100,
    showSider: true,
    showTop: true,
    mode: "edit",
    name: "New Dashboard",
  })
  .on(addSection, (state, section) => {
    return {
      ...state,
      sections: [...state.sections, section],
    };
  })
  .on(deleteSection, (state, section) => {
    const sections = state.sections.filter((s) => s.i !== section);
    return {
      ...state,
      sections,
    };
  })
  .on(setCurrentDashboard, (_, dashboard) => {
    return dashboard;
  })
  .on(changeLayouts, (state, { currentLayout, allLayouts }) => {
    const sections = state.sections.map((s) => {
      const l = currentLayout.find((ll) => ll.i === s.i);
      if (l) {
        s = { ...s, ...l };
      }
      return s;
    });
    return { ...state, sections, layouts: allLayouts };
  })
  .on(increment, (state, value) => {
    return { ...state, itemHeight: state.itemHeight + value };
  })
  .on(changeDefaults, (state) => {
    return { ...state, hasDashboards: true, hasDefaultDashboard: true };
  })
  .on(toggleDashboard, (state, published) => {
    return { ...state, published };
  })
  .on(toggle, (state) => {
    if (state.showSider) {
      return { ...state, showSider: false };
    } else if (state.showTop && !state.showSider) {
      return { ...state, showTop: false };
    } else if (state.showSider === false && state.showTop === false) {
      return { ...state, showTop: true, showSider: true };
    }
  });

export const $indicator = domain
  .createStore<IIndicator>({
    id: generateUid(),
    numerator: {
      id: generateUid(),
      type: "ANALYTICS",
      dataDimensions: {},
    },
    denominator: {
      id: generateUid(),
      type: "ANALYTICS",
      dataDimensions: {},
    },
    name: "",
    dataSource: "",
    description: "",
    factor: "1",
    useInBuildIndicators: false,
  })
  .on(changeIndicatorAttribute, (state, { attribute, value }) => {
    return { ...state, [attribute]: value };
  })
  // .on(changeDenominatorExpressionValue, (state, { attribute, value, id }) => {
  //   const expressions = state.denominator.expressions?.map((ex) => {
  //     if (ex.id === id) {
  //       return { ...ex, [attribute]: value };
  //     }
  //     return ex;
  //   });
  //   return {
  //     ...state,
  //     denominator: { ...state.denominator, expressions },
  //   };
  // })
  // .on(changeNumeratorExpressionValue, (state, { attribute, value, id }) => {
  //   const expressions = state.numerator.expressions?.map((ex) => {
  //     if (ex.id === id) {
  //       return { ...ex, [attribute]: value };
  //     }
  //     return ex;
  //   });

  //   return {
  //     ...state,
  //     numerator: { ...state.numerator, expressions },
  //   };
  // })
  // .on(addNumeratorExpression, (state, expression) => {
  //   let expressions: IExpression[] = [];

  //   if (state.numerator.expressions) {
  //     expressions = state.numerator.expressions;
  //   }
  //   return {
  //     ...state,
  //     numerator: {
  //       ...state.numerator,
  //       expressions: [...expressions, expression],
  //     },
  //   };
  // })
  // .on(addDenominatorExpression, (state, expression) => {
  //   let expressions: IExpression[] = [];

  //   if (state.denominator.expressions) {
  //     expressions = state.denominator.expressions;
  //   }
  //   return {
  //     ...state,
  //     denominator: {
  //       ...state.denominator,
  //       expressions: [...expressions, expression],
  //     },
  //   };
  // })
  // .on(changeDenominatorAttribute, (state, { attribute, value }) => {
  //   return {
  //     ...state,
  //     denominator: {
  //       ...state.denominator,
  //       [attribute]: value,
  //     },
  //   };
  // })
  .on(changeNumeratorAttribute, (state, { attribute, value }) => {
    return {
      ...state,
      numerator: {
        ...state.numerator,
        [attribute]: value,
      },
    };
  })
  // .on(changeDenominatorDataSource, (state, dataSource) => {
  //   return {
  //     ...state,
  //     denominator: { ...state.denominator, dataSource },
  //   };
  // })
  // .on(changeNumeratorDataSource, (state, dataSource) => {
  //   return {
  //     ...state,
  //     numerator: { ...state.numerator, dataSource },
  //   };
  // })
  .on(changeDataSource, (state, dataSource) => {
    return {
      ...state,
      dataSource: dataSource,
    };
  })
  .on(
    changeNumeratorDimension,
    (state, { id, what, type, remove, label = "" }) => {
      if (remove) {
        const { [id]: removed, ...others } = state.numerator.dataDimensions;
        return {
          ...state,
          numerator: {
            ...state.numerator,
            // dataDimensions: others,
          },
        };
      }
      return {
        ...state,
        numerator: {
          ...state.numerator,
          dataDimensions: {
            ...state.numerator.dataDimensions,
            [id]: { what, type, label },
          },
        },
      };
    }
  )
  .on(
    changeDenominatorDimension,
    (state, { id, what, type, remove, label = "" }) => {
      if (remove) {
        const { [id]: removed, ...others } = state.denominator.dataDimensions;
        return {
          ...state,
          denominator: {
            ...state.denominator,
            dataDimensions: others,
          },
        };
      }
      return {
        ...state,
        denominator: {
          ...state.denominator,
          dataDimensions: {
            ...state.denominator.dataDimensions,
            [id]: { what, type, label },
          },
        },
      };
    }
  )
  .on(changeUseIndicators, (state, useInBuildIndicators) => {
    return { ...state, useInBuildIndicators };
  });

export const $section = domain
  .createStore<ISection>({
    title: "Section title",
    visualizations: [],
    i: generateUid(),
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  })
  .on(setCurrentSection, (_, section) => section)
  .on(addVisualization2Section, (state) => {
    const visualization: IVisualization = {
      id: generateUid(),
      indicators: [],
      type: "",
      name: `Visualization ${state.visualizations.length + 1}`,
    };
    return {
      ...state,
      visualizations: [...state.visualizations, visualization],
    };
  });

export const $hasDHIS2 = combine(
  $indicator,
  $dataSources,
  (indicator, dataSources) => {
    return dataSources.find((ds) => ds.id === indicator.dataSource)
      ?.isCurrentDHIS2;
  }
);

export const $dataSourceType = combine(
  $indicator,
  $dataSources,
  (indicator, dataSources) => {
    const dataSource = dataSources.find((ds) => ds.id === indicator.dataSource);
    if (dataSource) {
      return dataSource.type;
    }
    return "";
  }
);
export const $dataSourceOptions = $dataSources.map((state) => {
  return state.map((dataSource) => {
    const current: Option = {
      value: dataSource.id,
      label: dataSource.name || "",
    };
    return current;
  });
});
forward({
  from: addSection,
  to: $section,
});

// export const $layout = $store.map((state) => {
//   const md = state.dashboard?.sections.map((s) => s.layout.md);
//   return { md };
// });
