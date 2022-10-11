import { combine } from "effector";
import { fromPairs, isEqual, sortBy } from "lodash";
import { domain } from "./Domain";
import {
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
  changePeriods,
  changeSectionAttribute,
  changeUseIndicators,
  changeVisualizationAttribute,
  changeVisualizationProperties,
  deleteSection,
  increment,
  onChangeOrganisations,
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
  updateVisualizationMetadata,
  changeCategory,
  changeDashboardName,
  changeDashboardDescription,
  changeSelectedDashboard,
  changeSelectedCategory,
  changeDataSourceId,
  changeCategoryId,
  changeDashboardId,
  changeAdministration,
  changeHasDashboards,
  addOverride,
  changeVisualizationOverride,
  changeVisualizationType,
  setDefaultDashboard,
  setCurrentPage,
  setDataSets,
  assignDataSet,
  setCategorization,
  setAvailableCategories,
  setAvailableCategoryOptionCombos,
} from "./Events";
import {
  ICategory,
  IDashboard,
  IDataSource,
  IIndicator,
  ISection,
  IStore,
  IVisualization,
  Option,
} from "./interfaces";
import { generateUid } from "./utils/uid";
import { getRelativePeriods, relativePeriodTypes } from "./utils/utils";

export const createSection = (id = generateUid()): ISection => {
  return {
    id,
    rowSpan: 1,
    colSpan: 1,
    title: "Example section",
    visualizations: [],
    direction: "row",
    display: "normal",
    justifyContent: "space-around",
    carouselOver: "items",
    images: [],
    isBottomSection: false,
    bg: "white",
  };
};

export const createCategory = (id = generateUid()): ICategory => {
  return {
    id,
    name: "",
    description: "",
  };
};

export const createDataSource = (id = generateUid()): IDataSource => {
  return {
    id,
    type: "DHIS2",
    authentication: {
      url: "",
      username: "",
      password: "",
    },
    isCurrentDHIS2: true,
  };
};

export const createIndicator = (id = generateUid()): IIndicator => {
  return {
    id,
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

export const createDashboard = (id = generateUid()): IDashboard => {
  return {
    id,
    sections: [],
    published: false,
    rows: 12,
    columns: 24,
    showSider: true,
    category: "uDWxMNyXZeo",
    showTop: true,
    name: "New Dashboard",
    refreshInterval: "off",
    dataSet: "",
    categorization: {},
    availableCategories: [],
    availableCategoryOptionCombos: [],
    bottomSection: { ...createSection(), isBottomSection: true, title: "" },
    bg: "gray.300",
  };
};

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
    periods: [{ id: "LAST_12_MONTHS", name: "Last 12 months" }],
    organisations: [],
    levels: [],
    groups: [],
    expandedKeys: [],
    selectedCategory: "",
    selectedDashboard: "",
    isAdmin: false,
    hasDashboards: false,
    defaultDashboard: "",
    currentPage: "",
    logo: "",
  })
  .on(setOrganisations, (state, organisations) => {
    return { ...state, organisations };
  })
  .on(setExpandedKeys, (state, expandedKeys) => {
    return { ...state, expandedKeys };
  })
  .on(setShowSider, (state, showSider) => {
    return { ...state, showSider };
  })
  .on(
    onChangeOrganisations,
    (state, { levels, groups, organisations, expandedKeys }) => {
      return { ...state, levels, groups, organisations, expandedKeys };
    }
  )
  .on(changePeriods, (state, periods) => {
    return { ...state, periods };
  })
  .on(changeSelectedCategory, (state, selectedCategory) => {
    return { ...state, selectedCategory };
  })
  .on(changeSelectedDashboard, (state, selectedDashboard) => {
    return { ...state, selectedDashboard };
  })
  .on(changeAdministration, (state, isAdmin) => {
    return { ...state, isAdmin };
  })
  .on(changeHasDashboards, (state, hasDashboards) => {
    return { ...state, hasDashboards };
  })
  .on(setDefaultDashboard, (state, defaultDashboard) => {
    return { ...state, defaultDashboard };
  })
  .on(setCurrentPage, (state, currentPage) => {
    return { ...state, currentPage };
  });

export const $dataSource = domain
  .createStore<IDataSource>(createDataSource())
  .on(setDataSource, (_, dataSource) => dataSource)
  .on(changeDataSourceId, (state, id) => {
    return { ...state, id };
  });

export const $category = domain
  .createStore<ICategory>(createCategory())
  .on(setCategory, (_, category) => category)
  .on(changeCategoryId, (state, id) => {
    return { ...state, id };
  });

export const $dashboard = domain
  .createStore<IDashboard>(createDashboard())
  .on(addSection, (state, section) => {
    if (section.isBottomSection) {
      return { ...state, bottomSection: section };
    }
    const isNew = state.sections.find((s) => s.id === section.id);
    let sections: ISection[] = state.sections;
    if (isNew) {
      sections = sections.map((s) => {
        if (s.id === section.id) {
          return section;
        }
        return s;
      });
    } else {
      sections = [...sections, section];
    }
    const currentDashboard = { ...state, sections };
    return currentDashboard;
  })
  .on(deleteSection, (state, section) => {
    const sections = state.sections.filter((s) => s.id !== section);
    return {
      ...state,
      sections,
    };
  })
  .on(setCurrentDashboard, (_, dashboard) => {
    return {
      ...dashboard,
      bottomSection: dashboard.bottomSection
        ? dashboard.bottomSection
        : { ...createSection(), isBottomSection: true, title: "" },
    };
  })
  .on(changeLayouts, (state, { currentLayout, allLayouts }) => {
    const sections = state.sections.map((s) => {
      const l = currentLayout.find((ll) => ll.i === s.id);
      if (l) {
        s = { ...s, ...l };
      }
      return s;
    });
    return { ...state, sections, layouts: allLayouts };
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
  })
  .on(changeCategory, (state, category) => {
    return { ...state, category };
  })
  .on(changeDashboardName, (state, name) => {
    return { ...state, name };
  })
  .on(changeDashboardDescription, (state, description) => {
    return { ...state, description };
  })
  .on(changeDashboardId, (state, id) => {
    return { ...state, id };
  })
  .on(changeVisualizationType, (state, { section, visualization }) => {
    const sections = state.sections.map((s) => {
      if (s.id === section.id) {
        const visualizations = section.visualizations.map((viz) => {
          return { ...viz, type: visualization };
        });
        return { ...section, visualizations };
      }
      return s;
    });
    return { ...state, sections };
  })
  .on(assignDataSet, (state, dataSet) => {
    return { ...state, dataSet };
  })
  .on(setCategorization, (state, categorization) => {
    return { ...state, categorization };
  })
  .on(setAvailableCategories, (state, availableCategories) => {
    return { ...state, availableCategories };
  })
  .on(
    setAvailableCategoryOptionCombos,
    (state, availableCategoryOptionCombos) => {
      return { ...state, availableCategoryOptionCombos };
    }
  );

export const $indicator = domain
  .createStore<IIndicator>(createIndicator())
  .on(changeIndicatorAttribute, (state, { attribute, value }) => {
    return { ...state, [attribute]: value };
  })
  .on(
    changeDenominatorExpressionValue,
    (state, { attribute, value, isGlobal }) => {
      if (state.denominator) {
        return {
          ...state,
          denominator: {
            ...state.denominator,
            expressions: {
              ...state.denominator.expressions,
              [attribute]: { value, isGlobal },
            },
          },
        };
      }
    }
  )
  .on(
    changeNumeratorExpressionValue,
    (state, { attribute, value, isGlobal }) => {
      if (state.numerator) {
        return {
          ...state,
          numerator: {
            ...state.numerator,
            expressions: {
              ...state.numerator.expressions,
              [attribute]: { value, isGlobal },
            },
          },
        };
      }
    }
  )
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
  .on(setCurrentSection, (_, section) => {
    return { ...section, images: section.images ? section.images : [] };
  })
  .on(addVisualization2Section, (state) => {
    const visualization: IVisualization = {
      id: generateUid(),
      indicator: "",
      type: "",
      name: `Visualization ${state.visualizations.length + 1}`,
      properties: {},
      overrides: {},
      group: "",
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
    changeVisualizationOverride,
    (state, { visualization, override, value }) => {
      const visualizations: IVisualization[] = state.visualizations.map(
        (v: IVisualization) => {
          if (v.id === visualization) {
            return {
              ...v,
              overrides: { ...v.overrides, [override]: value },
            };
          }
          return v;
        }
      );
      return { ...state, visualizations };
    }
  )
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

export const $dataSets = domain
  .createStore<Option[]>([])
  .on(setDataSets, (_, dataSets) => dataSets);

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
    const dataSource: IDataSource | undefined = dataSources.find(
      (ds) => ds.id === indicator.dataSource
    );
    if (dataSource) {
      return dataSource.type;
    }
    return "";
  }
);

export const $categoryDashboards = combine(
  $dashboards,
  $store,
  (dashboards, store) => {
    return dashboards
      .filter((dashboard) => dashboard.category === store.selectedCategory)
      .map((dataSource) => {
        const current: Option = {
          value: dataSource.id,
          label: dataSource.name || "",
        };
        return current;
      });
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

export const $categoryOptions = $categories.map((state) => {
  return state.map((category) => {
    const current: Option = {
      value: category.id,
      label: category.name || "",
    };
    return current;
  });
});

export const $indicatorDataSourceTypes = combine(
  $indicators,
  $dataSources,
  (indicators, dataSources) => {
    const allIndicators: string[][] = indicators.map((indicator) => {
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

export const $categoryOptionCombo = $dashboard.map(
  ({ categorization, availableCategoryOptionCombos }) => {
    const combos = Object.values(categorization);
    const availableCombos = availableCategoryOptionCombos.map(
      ({ categoryOptions, id }: any) => {
        return {
          id,
          categoryOptions: categoryOptions.map(({ id }: any) => id),
        };
      }
    );
    if (combos.length === 2) {
      const category1 = combos[0].map(({ value }: any) => value);
      const category2 = combos[1].map(({ value }: any) => value);
      return category1
        .flatMap((v: string) => {
          return category2.map((v2) => {
            const search = availableCombos.find(({ categoryOptions }: any) => {
              return isEqual(sortBy([v, v2]), sortBy(categoryOptions));
            });
            return search?.id;
          });
        })
        .filter((v) => !!v);
    }
    return [];
  }
);

export const $globalFilters = combine(
  $store,
  $categoryOptionCombo,
  $dashboard,
  (store, categoryOptionCombo, dashboard) => {
    const periods = store.periods.flatMap(({ id }) => {
      if (relativePeriodTypes.indexOf(id) !== -1) {
        return getRelativePeriods(id);
      }
      return [id];
    });

    console.log(dashboard.dataSet);

    if (dashboard.dataSet && categoryOptionCombo) {
      return {
        m5D13FqKZwN: periods,
        of2WvtwqbHR: store.groups,
        GQhi6pRnTKF: store.levels,
        mclvD0Z9mfT: store.organisations,
        WSiMOMi4QWh: categoryOptionCombo,
      };
    } else if (!dashboard.dataSet) {
      return {
        m5D13FqKZwN: periods,
        of2WvtwqbHR: store.groups,
        GQhi6pRnTKF: store.levels,
        mclvD0Z9mfT: store.organisations,
        WSiMOMi4QWh: categoryOptionCombo,
      };
    }

    return {};
  }
);

$categoryOptionCombo.watch((store) => {
  // console.log(store);
});
