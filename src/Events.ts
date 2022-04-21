import { SingleValue } from "chakra-react-select";
import { Layout, Layouts } from "react-grid-layout";
import { domain } from "./Domain";
import {
  IDashboard,
  INamed,
  IDataSource,
  ISection,
  IVisualization,
  Pagination,
  IExpression,
  DataNode,
  IIndicator,
  Option,
  ICategory,
} from "./interfaces";

export const loadDefaults = domain.createEvent<{
  dashboards: string[];
  categories: string[];
  dataSources: string[];
  settings: string[];
  organisationUnits: DataNode[];
}>();

export const addCategory = domain.createEvent<string>();
export const setShowSider = domain.createEvent<boolean>();
export const setDataSources = domain.createEvent<IDataSource[]>();
export const setCategories = domain.createEvent<ICategory[]>();
export const setCurrentDashboard = domain.createEvent<IDashboard>();
export const updateSection = domain.createEvent<void>();
export const addSection = domain.createEvent<ISection>();
export const addVisualization2Section = domain.createEvent<void>();
export const deleteSection = domain.createEvent<string | undefined>();
export const setCurrentSection = domain.createEvent<ISection>();
export const toggleDashboard = domain.createEvent<boolean>();
export const changeVisualizationDataSource = domain.createEvent<IDataSource>();
export const changeVisualizationType = domain.createEvent<string>();
export const setCurrentVisualization = domain.createEvent<IVisualization>();
export const addPagination = domain.createEvent<{
  [key: string]: number;
}>();

export const changeNumeratorDataSource = domain.createEvent<IDataSource>();
export const changeDataSource = domain.createEvent<string | undefined>();
export const setDataSource = domain.createEvent<IDataSource>();
export const changeDenominatorDataSource = domain.createEvent<IDataSource>();
export const addNumeratorExpression = domain.createEvent<IExpression>();
export const addDenominatorExpression = domain.createEvent<IExpression>();
export const removeNumeratorExpression = domain.createEvent<IExpression>();
export const removeDenominatorExpression = domain.createEvent<IExpression>();
export const changeLayouts = domain.createEvent<{
  currentLayout: Layout[];
  allLayouts: Layouts;
}>();
export const changeNumeratorExpressionValue = domain.createEvent<{
  attribute: "key" | "value";
  id: string;
  value: string;
}>();
export const changeDenominatorExpressionValue = domain.createEvent<{
  attribute: "key" | "value";
  id: string;
  value: string;
}>();

export const changeIndicatorAttribute = domain.createEvent<{
  attribute: "name" | "description" | "factor";
  value: any;
}>();

export const changeNumeratorAttribute = domain.createEvent<{
  attribute: "name" | "description" | "type";
  value: any;
}>();
export const changeDenominatorAttribute = domain.createEvent<{
  attribute: "name" | "description" | "type";
  value: any;
}>();

export const changeNumeratorDimension = domain.createEvent<{
  id: string;
  what: string;
  type: string;
  remove?: boolean;
  label?: string;
}>();

export const changeDenominatorDimension = domain.createEvent<{
  id: string;
  what: string;
  type: string;
  remove?: boolean;
  label?: string;
}>();

export const removeNumeratorDimension = domain.createEvent<string>();

export const changeUseIndicators = domain.createEvent<boolean>();
export const changeVisualizationQueries = domain.createEvent<IIndicator[]>();
export const changeDefaults = domain.createEvent<void>();
export const increment = domain.createEvent<number>();
export const changeCategory = domain.createEvent<SingleValue<Option>>();
export const toggle = domain.createEvent<void>();