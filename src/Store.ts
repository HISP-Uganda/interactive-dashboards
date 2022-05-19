import { combine } from "effector";
import { fromPairs } from "lodash";
import moment from "moment";
import { domain } from "./Domain";
import {
  addDenominatorExpression,
  addNumeratorExpression,
  addPagination,
  addSection,
  addVisualization2Section,
  changeDataSource,
  changeDefaults,
  changeDenominatorAttribute,
  changeDenominatorDimension,
  changeDenominatorExpressionValue,
  changeIndicatorAttribute,
  changeLayouts,
  changeNumeratorAttribute,
  changeNumeratorDimension,
  changeNumeratorExpressionValue,
  changeOrganisations,
  changeSectionAttribute,
  changeUseIndicators,
  changeVisualizationAttribute,
  changeVisualizationProperties,
  deleteSection,
  increment,
  setCategories,
  setCategory,
  setCurrentDashboard,
  setCurrentSection,
  setDashboards,
  setDataSource,
  setDataSources,
  setExpandedKeys,
  setIndicator,
  setOrganisations,
  setRefreshInterval,
  setShowSider,
  setVisualizationQueries,
  toggle,
  toggleDashboard,
  updateVisualizationData,
  onChangeFixedPeriod,
  onChangeRelativeTime,
  updateVisualizationMetadata,
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
    title: "Example section",
    visualizations: [],
    direction: "row",
  };
};

export const createCategory = (): ICategory => {
  const id = generateUid();
  return {
    id,
    name: "",
    description: "",
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

export const createIndicator = (): IIndicator => {
  return {
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
    query: "",
    useInBuildIndicators: false,
  };
};

export const $organisations = domain
  .createStore<any[]>([])
  .on(setOrganisations, (_, organisations) => organisations);
export const $expandedKeys = domain
  .createStore<string[]>([])
  .on(setExpandedKeys, (_, expandedKeys) => expandedKeys);

export const $paginations = domain
  .createStore<{ [key: string]: number }>({
    totalDataElements: 0,
    totalSQLViews: 0,
    totalIndicators: 0,
    totalProgramIndicators: 0,
    totalOrganisationUnitLevels: 0,
    totalOrganisationUnitGroups: 0,
  })
  .on(addPagination, (state, pagination) => {
    return {
      ...state,
      ...pagination,
    };
  });

export const $store = domain
  .createStore<IStore>({
    showSider: true,
    selectedOrganisation: "",
    fixedPeriod: [moment().startOf("month").subtract(1, "month"), moment()],
    relativePeriod: { value: "LAST_MONTH", label: "Last Month" },
    periodType: {
      value: "fixed",
      label: "Fixed",
    },
  })
  .on(setShowSider, (state, showSider) => {
    return { ...state, showSider };
  })
  .on(changeOrganisations, (state, selectedOrganisation) => {
    return { ...state, selectedOrganisation };
  })
  .on(onChangeFixedPeriod, (state, { periodType, value }) => {
    return { ...state, periodType, fixedPeriod: value };
  })
  .on(onChangeRelativeTime, (state, { periodType, value }) => {
    return { ...state, periodType, relativePeriod: value };
  });

export const $dataSource = domain
  .createStore<IDataSource>(createDataSource())
  .on(setDataSource, (_, dataSource) => dataSource);

export const $category = domain
  .createStore<ICategory>(createCategory())
  .on(setCategory, (_, category) => category);

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
    refreshInterval: "off",
  })
  .on(addSection, (state, section) => {
    const isNew = state.sections.find((s) => s.i === section.i);
    let sections: ISection[] = state.sections;
    if (isNew) {
      sections = sections.map((s) => {
        if (s.i === section.i) {
          return section;
        }
        return s;
      });
    } else {
      sections = [...sections, section];
    }
    return { ...state, sections };
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
  })
  .on(setRefreshInterval, (state, refreshInterval) => {
    return { ...state, refreshInterval };
  });

export const $indicator = domain
  .createStore<IIndicator>(createIndicator())
  .on(changeIndicatorAttribute, (state, { attribute, value }) => {
    return { ...state, [attribute]: value };
  })
  .on(changeDenominatorExpressionValue, (state, { attribute, value }) => {
    if (state.denominator) {
      return {
        ...state,
        denominator: {
          ...state.denominator,
          expressions: { ...state.denominator.expressions, [attribute]: value },
        },
      };
    }
  })
  .on(changeNumeratorExpressionValue, (state, { attribute, value }) => {
    if (state.numerator) {
      return {
        ...state,
        numerator: {
          ...state.numerator,
          expressions: { ...state.numerator.expressions, [attribute]: value },
        },
      };
    }
  })
  // .on(addNumeratorExpression, (state, expression) => {
  //   if (state.numerator) {
  //     let expressions: IExpression[] = [];

  //     if (state.numerator.expressions) {
  //       expressions = state.numerator.expressions;
  //     }
  //     return {
  //       ...state,
  //       numerator: {
  //         ...state.numerator,
  //         expressions: [...expressions, expression],
  //       },
  //     };
  //   }
  // })
  // .on(addDenominatorExpression, (state, expression) => {
  //   if (state.denominator) {
  //     let expressions: IExpression[] = [];

  //     if (state.denominator.expressions) {
  //       expressions = state.denominator.expressions;
  //     }
  //     return {
  //       ...state,
  //       denominator: {
  //         ...state.denominator,
  //         expressions: [...expressions, expression],
  //       },
  //     };
  //   }
  // })
  .on(changeDenominatorAttribute, (state, { attribute, value }) => {
    if (state.denominator) {
      return {
        ...state,
        denominator: {
          ...state.denominator,
          [attribute]: value,
        },
      };
    }
  })
  .on(changeNumeratorAttribute, (state, { attribute, value }) => {
    console.log(attribute, value);
    if (state.numerator) {
      return {
        ...state,
        numerator: {
          ...state.numerator,
          [attribute]: value,
        },
      };
    }
  })
  .on(changeDataSource, (state, dataSource) => {
    return {
      ...state,
      dataSource: dataSource,
    };
  })
  .on(
    changeNumeratorDimension,
    (state, { id, what, type, replace, remove, label = "" }) => {
      if (state.numerator) {
        if (remove) {
          const { [id]: removed, ...others } = state.numerator.dataDimensions;
          return {
            ...state,
            numerator: {
              ...state.numerator,
              dataDimensions: others,
            },
          };
        }

        if (replace) {
          const working = fromPairs(
            Object.entries(state.numerator.dataDimensions).filter(
              ([i, d]) => d.what !== what
            )
          );
          return {
            ...state,
            numerator: {
              ...state.numerator,
              dataDimensions: {
                ...working,
                [id]: { what, type, label },
              },
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
    }
  )
  .on(
    changeDenominatorDimension,
    (state, { id, what, type, replace, remove, label = "" }) => {
      if (state.denominator) {
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

        if (replace) {
          const working = fromPairs(
            Object.entries(state.denominator.dataDimensions).filter(
              ([_, d]) => d.what !== what
            )
          );
          return {
            ...state,
            denominator: {
              ...state.denominator,
              dataDimensions: {
                ...working,
                [id]: { what, type, label },
              },
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
    }
  )
  .on(changeUseIndicators, (state, useInBuildIndicators) => {
    return { ...state, useInBuildIndicators };
  })
  .on(setIndicator, (_, indicator) => indicator);

export const $section = domain
  .createStore<ISection>(createSection())
  .on(setCurrentSection, (_, section) => section)
  .on(addVisualization2Section, (state) => {
    const visualization: IVisualization = {
      id: generateUid(),
      indicator: "",
      type: "",
      name: `Visualization ${state.visualizations.length + 1}`,
      properties: {},
    };
    return {
      ...state,
      visualizations: [...state.visualizations, visualization],
    };
  })
  .on(
    changeVisualizationAttribute,
    (state, { attribute, value, visualization }) => {
      const visualizations = state.visualizations.map((v: IVisualization) => {
        if (v.id === visualization) {
          return { ...v, [attribute]: value };
        }
        return v;
      });
      return { ...state, visualizations };
    }
  )
  .on(changeSectionAttribute, (state, { attribute, value }) => {
    return { ...state, [attribute]: value };
  })
  .on(
    changeVisualizationProperties,
    (state, { attribute, value, visualization }) => {
      const visualizations: IVisualization[] = state.visualizations.map(
        (v: IVisualization) => {
          if (v.id === visualization) {
            return {
              ...v,
              properties: { ...v.properties, [attribute]: value },
            };
          }
          return v;
        }
      );
      return { ...state, visualizations };
    }
  );

export const $dataSources = domain
  .createStore<IDataSource[]>([])
  .on(setDataSources, (_, dataSources) => dataSources);
export const $indicators = domain
  .createStore<IIndicator[]>([])
  .on(setVisualizationQueries, (_, indicators) => indicators);
export const $categories = domain
  .createStore<ICategory[]>([])
  .on(setCategories, (_, categories) => categories);
export const $dashboards = domain
  .createStore<IDashboard[]>([])
  .on(setDashboards, (_, dashboards) => dashboards);

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

export const $indicatorDataSourceTypes = combine(
  $indicators,
  $dataSources,
  (indicators, dataSources) => {
    const allIndicators = indicators.map((indicator) => {
      const dataSource = dataSources.find(
        (ds) => ds.id === indicator.dataSource
      );
      return [indicator.id, dataSource?.type || ""];
    });
    return fromPairs(allIndicators);
  }
);

export const $visualizationData = domain
  .createStore<{ [key: string]: any[] }>({})
  .on(updateVisualizationData, (state, { visualizationId, data }) => {
    return { ...state, [visualizationId]: data };
  });
export const $visualizationMetadata = domain
  .createStore<{ [key: string]: any[] }>({})
  .on(updateVisualizationMetadata, (state, { visualizationId, data }) => {
    return { ...state, [visualizationId]: data };
  });

export const $dashboardCategory = combine(
  $dashboard,
  $categories,
  (dashboard, categories) => {
    const category = categories.find((c) => {
      return c.id === dashboard.category;
    });
    if (category) {
      return category.name;
    }
    return "Unknown category";
  }
);

// forward({
//   from: addSection,
//   to: $section,
// });

// export const $layout = $store.map((state) => {
//   const md = state.dashboard?.sections.map((s) => s.layout.md);
//   return { md };
// });
