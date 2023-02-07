import { combine } from "effector";
import { fromPairs, isEqual, sortBy } from "lodash";
import { headerHeight, padding, sideWidth } from "./components/constants";
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
  changeNumeratorAttribute,
  changeNumeratorDimension,
  changeNumeratorExpressionValue,
  changePeriods,
  changeSectionAttribute,
  changeUseIndicators,
  changeVisualizationAttribute,
  changeVisualizationProperties,
  deleteSection,
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
  changeVisualizationOverride,
  changeVisualizationType,
  setDefaultDashboard,
  setCurrentPage,
  setDataSets,
  assignDataSet,
  setCategorization,
  setAvailableCategories,
  setAvailableCategoryOptionCombos,
  setTargetCategoryOptionCombos,
  setSystemId,
  setCheckedKeys,
  setLevels,
  setGroups,
  setShowFooter,
  setSystemName,
  setMinSublevel,
  setMaxLevel,
  deleteSectionVisualization,
  setInstanceBaseUrl,
  setIsNotDesktop,
  setIsFullScreen,
  duplicateVisualization,
  setRefresh,
  setThemes,
  setDataElements,
  setHasChildren,
  setNodeSource,
  setVersion,
  setRows,
  setColumns,
  setOriginalColumns,
  setSections,
  setVisualizations,
  setDataElementGroups,
  setDataElementGroupSets,
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
    height: "100%",
    headerBg: "",
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
    custom: false,
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
    targetCategoryCombo: "",
    targetCategoryOptionCombos: [],
    nodeSource: {},
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
    totalOrganisationUnitGroupSets: 0,
    totalDataElementGroups: 0,
    totalDataElementGroupSets: 0,
  })
  .on(addPagination, (state, pagination) => {
    return {
      ...state,
      ...pagination,
    };
  });

export const $filters = domain.createStore<{ [key: string]: any }>({});

export const $store = domain
  .createStore<IStore>({
    showSider: false,
    periods: [{ id: "LAST_5_FINANCIAL_YEARS", name: "Last 5 financial years" }],
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
    systemId: "",
    checkedKeys: [],
    showFooter: false,
    systemName: "",
    minSublevel: 2,
    maxLevel: 5,
    instanceBaseUrl: "",
    isNotDesktop: false,
    isFullScreen: false,
    refresh: true,
    themes: [],
    dataElements: [],
    version: "",
    rows: [],
    columns: [],
    originalColumns: [],
    dataElementGroups: [],
    dataElementGroupSets: [],
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
    (state, { levels, groups, organisations, expandedKeys, checkedKeys }) => {
      return {
        ...state,
        levels,
        groups,
        organisations,
        expandedKeys,
        checkedKeys,
      };
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
  })
  .on(setSystemId, (state, systemId) => {
    return { ...state, systemId };
  })
  .on(setCheckedKeys, (state, checkedKeys) => {
    return { ...state, checkedKeys };
  })
  .on(setLevels, (state, levels) => {
    return { ...state, levels };
  })
  .on(setGroups, (state, groups) => {
    return { ...state, groups };
  })
  .on(setShowFooter, (state, showFooter) => {
    return { ...state, showFooter };
  })
  .on(setSystemName, (state, systemName) => {
    return { ...state, systemName };
  })
  .on(setMinSublevel, (state, minSublevel) => {
    return { ...state, minSublevel };
  })
  .on(setMaxLevel, (state, maxLevel) => {
    return { ...state, maxLevel };
  })
  .on(setInstanceBaseUrl, (state, instanceBaseUrl) => {
    return { ...state, instanceBaseUrl };
  })
  .on(setIsNotDesktop, (state, isNotDesktop) => {
    return { ...state, isNotDesktop };
  })
  .on(setIsFullScreen, (state, isFullScreen) => {
    return { ...state, isFullScreen };
  })
  .on(setRefresh, (state, refresh) => {
    return { ...state, refresh };
  })
  .on(setThemes, (state, themes) => {
    return { ...state, themes };
  })
  .on(setDataElements, (state, dataElements) => {
    return { ...state, dataElements };
  })
  .on(setVersion, (state, version) => {
    return { ...state, version };
  })
  .on(setRows, (state, rows) => {
    return { ...state, rows };
  })
  .on(setColumns, (state, columns) => {
    return { ...state, columns };
  })
  .on(setOriginalColumns, (state, originalColumns) => {
    return { ...state, originalColumns };
  })
  .on(setDataElementGroups, (state, dataElementGroups) => {
    return { ...state, dataElementGroups };
  })
  .on(setDataElementGroupSets, (state, dataElementGroupSets) => {
    return { ...state, dataElementGroupSets };
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
  )
  .on(setTargetCategoryOptionCombos, (state, targetCategoryOptionCombos) => {
    return { ...state, targetCategoryOptionCombos };
  })
  .on(setHasChildren, (state, hasChildren) => {
    return { ...state, hasChildren };
  })
  .on(setNodeSource, (state, { field, value }) => {
    const nodeSource = state.nodeSource || {};
    return { ...state, nodeSource: { ...nodeSource, [field]: value } };
  })
  .on(setSections, (state, sections) => {
    return { ...state, sections };
  });

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
    (state, { id, dimension, type, resource, replace, remove, label = "" }) => {
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
              ([i, d]) => d.resource !== resource
            )
          );

          return {
            ...state,
            numerator: {
              ...state.numerator,
              dataDimensions: {
                ...working,
                [id]: { id, resource, type, dimension, label },
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
              [id]: { id, resource, type, dimension, label },
            },
          },
        };
      }
    }
  )
  .on(
    changeDenominatorDimension,
    (state, { id, dimension, resource, type, replace, remove, label = "" }) => {
      if (state.denominator) {
        if (remove) {
          const { [id]: removed, ...rest } = state.denominator.dataDimensions;
          return {
            ...state,
            denominator: {
              ...state.denominator,
              dataDimensions: rest,
            },
          };
        }

        if (replace) {
          const working = fromPairs(
            Object.entries(state.denominator.dataDimensions).filter(
              ([_, d]) => d.resource !== resource
            )
          );
          return {
            ...state,
            denominator: {
              ...state.denominator,
              dataDimensions: {
                ...working,
                [id]: { id, dimension, type, resource, label },
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
              [id]: { id, type, dimension, resource, label },
            },
          },
        };
      }
    }
  )
  .on(changeUseIndicators, (state, useInBuildIndicators) => {
    return { ...state, useInBuildIndicators };
  })
  .on(setIndicator, (_, indicator) => {
    console.log(indicator);
    return indicator;
  });

export const $section = domain
  .createStore<ISection>(createSection())
  .on(setCurrentSection, (_, section) => {
    return { ...section, images: section.images ? section.images : [] };
  })
  .on(addVisualization2Section, (state, id) => {
    const visualization: IVisualization = {
      id,
      indicator: "",
      type: "",
      name: `Visualization ${state.visualizations.length + 1}`,
      properties: {},
      overrides: {},
      group: "",
      bg: "",
    };
    return {
      ...state,
      visualizations: [...state.visualizations, visualization],
    };
  })
  .on(duplicateVisualization, (state, visualization) => {
    return {
      ...state,
      visualizations: [...state.visualizations, visualization],
    };
  })
  .on(deleteSectionVisualization, (state, visualizationId) => {
    return {
      ...state,
      visualizations: state.visualizations.filter(
        ({ id }) => id !== visualizationId
      ),
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
  )
  .on(setVisualizations, (state, visualizations) => {
    return { ...state, visualizations };
  });

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
    const category: ICategory | undefined = categories.find((c) => {
      return c.id === dashboard.category;
    });
    if (category) {
      return category.name;
    }
    return "Unknown category";
  }
);

export const $categoryOptionCombo = $dashboard.map(
  ({ availableCategories, categorization, availableCategoryOptionCombos }) => {
    const combos: any[] = availableCategories
      .map(({ id }) => categorization[id])
      .filter((v) => !!v);
    let availableCombos: any[] = [];
    let result = { prev: [], current: [] };
    if (availableCategoryOptionCombos) {
      availableCombos = availableCategoryOptionCombos.map(
        ({ categoryOptions, id }: any) => {
          return {
            id,
            categoryOptions: categoryOptions.map(({ id }: any) => id),
          };
        }
      );
    }

    if (combos.length === 2) {
      const [{ categoryOptions }] = availableCategories;
      const category1 = combos[0].map(({ value }: any) => value);
      const category2 = combos[1].map(({ value }: any) => value);
      const index = categoryOptions.findIndex(
        (x: any) => category1[category1.length - 1] === x.value
      );

      if (index > 0) {
        const prevOption = categoryOptions[index - 1];

        const prev = category2.map((v: string) => {
          const search = availableCombos.find(({ categoryOptions }: any) => {
            return isEqual(
              sortBy([v, prevOption.value]),
              sortBy(categoryOptions)
            );
          });
          return search?.id;
        });
        result = { ...result, prev };
      }

      const current = category1
        .flatMap((v: string) => {
          return category2.map((v2: any) => {
            const search = availableCombos.find(({ categoryOptions }: any) => {
              return isEqual(sortBy([v, v2]), sortBy(categoryOptions));
            });
            return search?.id;
          });
        })
        .filter((v: any) => !!v);
      result = { ...result, current };
    }
    return result;
  }
);

export const $targetCategoryOptionCombo = $dashboard.map(
  ({ categorization, availableCategories, targetCategoryOptionCombos }) => {
    if (
      availableCategories &&
      availableCategories.length > 0 &&
      targetCategoryOptionCombos &&
      targetCategoryOptionCombos.length > 0
    ) {
      const categoryId = availableCategories[0].id;
      const categories = categorization[categoryId];

      return categories.flatMap(({ value }) => {
        const targetCOC: any = targetCategoryOptionCombos.find(
          ({ categoryOptions }) => {
            return categoryOptions.map(({ id }: any) => id).join("") === value;
          }
        );
        if (targetCOC) {
          return [targetCOC.id];
        }
        return [];
      });
    }
    return [];
  }
);

export const $globalFilters = combine(
  $store,
  $categoryOptionCombo,
  $dashboard,
  $targetCategoryOptionCombo,
  (store, categoryOptionCombo, dashboard, target) => {
    const periods = store.periods.flatMap(({ id }) => {
      if (relativePeriodTypes.indexOf(id) !== -1) {
        return getRelativePeriods(id);
      }
      return [id];
    });
    let filters: { [key: string]: any } = {
      m5D13FqKZwN: periods,
      GQhi6pRnTKF: [store.levels.sort()[store.levels.length - 1]],
      mclvD0Z9mfT: store.organisations,
      ww1uoD3DsYg: [store.minSublevel],
    };

    if (store.groups.length > 0) {
      filters = { ...filters, of2WvtwqbHR: store.groups };
    }
    if (dashboard.dataSet && categoryOptionCombo.current.length > 0) {
      filters = {
        ...filters,
        WSiMOMi4QWh: categoryOptionCombo.current,
      };
    }
    if (dashboard.dataSet && categoryOptionCombo.prev.length > 0) {
      filters = { ...filters, IK4jwzIuqNO: categoryOptionCombo.prev };
    }
    if (dashboard.targetCategoryCombo && target.length > 0) {
      return { ...filters, OOhWJ4gfZy1: target };
    }
    if (store.dataElements.length > 0) {
      filters = {
        ...filters,
        h9oh0VhweQM: store.dataElements.map((de) => de.id),
      };
    }

    if (store.dataElementGroups.length > 0) {
      filters = {
        ...filters,
        JsPfHe1QkJe: store.dataElementGroups,
      };
    }

    if (store.dataElementGroupSets.length > 0) {
      filters = {
        ...filters,
        HdiJ61vwqTX: store.dataElementGroupSets,
      };
    }
    return filters;
  }
);

export const $dimensions = $store.map(
  ({ isNotDesktop, showSider, isFullScreen }) => {
    const maxDashboardHeight = padding * 2 + headerHeight;
    const otherHeight = padding * 4 + headerHeight * 3;
    const realHeight = `calc(100vh - ${maxDashboardHeight}px)`;
    let initial = {
      dashboardHeight: realHeight,
      dashboardWidth: `calc(100vw - ${sideWidth + padding * 2}px)`,
      dashboardColumns: `${sideWidth}px 1fr`,
      showSide: true,
      otherHeight: `calc(100vh - ${otherHeight}px)`,
      sectionHeight: `calc(100vh - ${otherHeight}px - ${headerHeight})`,
      isNotDesktop,
    };

    if (isFullScreen) {
      initial = {
        ...initial,
        showSide: false,
        dashboardWidth: `100vw - ${padding * 2}px`,
      };
    } else if (isNotDesktop) {
      initial = {
        ...initial,
        showSide: false,
        dashboardWidth: `100vw - ${padding * 2}px`,
      };
    } else if (!isNotDesktop) {
      if (showSider) {
        initial = {
          ...initial,
          showSide: true,
          dashboardWidth: `calc(100vw - ${sideWidth + padding * 2}px)`,
        };
      } else {
        initial = {
          ...initial,
          showSide: false,
          dashboardWidth: `100vw - ${padding * 2}px`,
          dashboardColumns: "auto",
        };
      }
    }
    return initial;
  }
);
// $previousCategoryOptionCombo.watch((v) => console.log(v));
