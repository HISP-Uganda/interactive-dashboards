import { domain } from "./Domain";
import {
    DataNode,
    DataValueAttribute,
    Dimension,
    ICategory,
    IDashboard,
    IDataElement,
    IDataSource,
    IIndicator,
    ISection,
    Item,
    IVisualization,
    Option,
} from "./interfaces";

export const loadDefaults = domain.createEvent<{
    dashboards: string[];
    categories: string[];
    dataSources: string[];
    settings: string[];
    organisationUnits: DataNode[];
}>();

export const setShowSider = domain.createEvent<boolean>();
export const setDataSources = domain.createEvent<IDataSource[]>();
export const setCategories = domain.createEvent<ICategory[]>();
export const setDashboards = domain.createEvent<IDashboard[]>();
export const setCurrentDashboard = domain.createEvent<IDashboard>();
export const addSection = domain.createEvent<ISection>();
export const addVisualization2Section = domain.createEvent<string>();
export const duplicateVisualization = domain.createEvent<IVisualization>();
export const deleteSection = domain.createEvent<string | undefined>();
export const deleteSectionVisualization = domain.createEvent<string>();
export const setCurrentSection = domain.createEvent<ISection>();
export const toggleDashboard = domain.createEvent<boolean>();
export const changeDashboardId = domain.createEvent<string>();
export const changeCategoryId = domain.createEvent<string>();
export const changeDataSourceId = domain.createEvent<string>();
export const changeAdministration = domain.createEvent<boolean>();
export const addPagination = domain.createEvent<{
    [key: string]: number;
}>();

export const changeDataSource = domain.createEvent<string | undefined>();
export const setDataSource = domain.createEvent<IDataSource>();
export const setCategory = domain.createEvent<ICategory>();
export const setIndicator = domain.createEvent<IIndicator>();

export const changeNumeratorExpressionValue = domain.createEvent<{
    attribute: string;
    value: string;
    isGlobal: boolean;
}>();
export const changeDenominatorExpressionValue = domain.createEvent<{
    attribute: string;
    value: string;
    isGlobal: boolean;
}>();

export const changeIndicatorAttribute = domain.createEvent<{
    attribute: "name" | "description" | "factor" | "query" | "custom";
    value: any;
}>();

export const changeVisualizationData = domain.createEvent<{
    attribute: "name" | "description" | "factor" | "query";
    value: any;
}>();

export const changeNumeratorAttribute =
    domain.createEvent<DataValueAttribute>();
export const changeDenominatorAttribute =
    domain.createEvent<DataValueAttribute>();

export const changeNumeratorDimension = domain.createEvent<Dimension>();

export const changeDenominatorDimension = domain.createEvent<Dimension>();

export const changeUseIndicators = domain.createEvent<boolean>();
export const setVisualizationQueries = domain.createEvent<IIndicator[]>();
export const changeDefaults = domain.createEvent<void>();
export const increment = domain.createEvent<number>();
export const changeCategory = domain.createEvent<string>();
export const changeDashboardName = domain.createEvent<string>();
export const changeDashboardDescription = domain.createEvent<string>();
export const changeSelectedCategory = domain.createEvent<string>();
export const changeSelectedDashboard = domain.createEvent<string>();
export const setAsDefault = domain.createEvent<boolean>();
export const changeRefreshRate = domain.createEvent<string>();
export const toggle = domain.createEvent<void>();
export const changeVisualizationAttribute = domain.createEvent<{
    attribute: string;
    value?: any;
    visualization: string;
}>();

export const changeVisualizationOverride = domain.createEvent<{
    override: string;
    value: string;
    visualization: string;
}>();

export const changeSectionAttribute = domain.createEvent<{
    attribute: string;
    value?: any;
}>();

export const addOverride = domain.createEvent<{
    attribute: "ou" | "dx" | "pe";
    value: string;
}>();

export const changeVisualizationProperties = domain.createEvent<{
    visualization: string;
    attribute: string;
    value?: any;
}>();

export const updateVisualizationData = domain.createEvent<{
    visualizationId: string;
    data: any;
}>();

export const updateVisualizationMetadata = domain.createEvent<{
    visualizationId: string;
    data: any;
}>();

export const setOrganisations = domain.createEvent<string[]>();
export const setExpandedKeys = domain.createEvent<React.Key[]>();
export const changeOrganisations = domain.createEvent<string>();
export const setRefreshInterval = domain.createEvent<string>();
export const setDefaultDashboard = domain.createEvent<string>();
export const changeHasDashboards = domain.createEvent<boolean>();
export const changeVisualizationType = domain.createEvent<{
    visualization: string;
    section: ISection;
}>();

export const changePeriods = domain.createEvent<Item[]>();

export const onChangeOrganisations = domain.createEvent<{
    levels: string[];
    organisations: string[];
    groups: string[];
    expandedKeys: React.Key[];
    checkedKeys: React.Key[];
}>();

export const setCurrentPage = domain.createEvent<string>();

export const setDataSets = domain.createEvent<Option[]>();
export const assignDataSet = domain.createEvent<string>();

export const setCategorization = domain.createEvent<{
    [key: string]: any[];
}>();

export const setHasChildren = domain.createEvent<boolean | undefined>();
export const setNodeSource = domain.createEvent<{
    field: string;
    value: string;
}>();
export const setVersion = domain.createEvent<string>();
export const setAvailableCategories = domain.createEvent<any[]>();
export const setRows = domain.createEvent<any[]>();
export const setColumns = domain.createEvent<any[]>();
export const setOriginalColumns = domain.createEvent<any[]>();
export const setSections = domain.createEvent<ISection[]>();
export const setVisualizations = domain.createEvent<IVisualization[]>();
export const setAvailableCategoryOptionCombos = domain.createEvent<any[]>();
export const setTargetCategoryOptionCombos = domain.createEvent<any[]>();
export const setSystemId = domain.createEvent<string>();
export const setCheckedKeys = domain.createEvent<
    { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
>();

export const setLevels = domain.createEvent<string[]>();
export const setDataElements = domain.createEvent<IDataElement[]>();
export const setGroups = domain.createEvent<string[]>();
export const setThemes = domain.createEvent<string[]>();
export const setShowFooter = domain.createEvent<boolean>();
export const setSystemName = domain.createEvent<string>();
export const setInstanceBaseUrl = domain.createEvent<string>();
export const setMinSublevel = domain.createEvent<number>();
export const setMaxLevel = domain.createEvent<number>();
export const setIsNotDesktop = domain.createEvent<boolean>();
export const setIsFullScreen = domain.createEvent<boolean>();
export const setRefresh = domain.createEvent<boolean>();

export const setDataElementGroups = domain.createEvent<string[]>();
export const setDataElementGroupSets = domain.createEvent<string[]>();
