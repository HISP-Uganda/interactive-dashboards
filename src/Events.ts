import { domain } from "./Domain";
import {
  IDashboard,
  INamed,
  IDataSource,
  ISection,
  IVisualization,
  Pagination,
  IExpression,
} from "./interfaces";

export const loadDefaults = domain.createEvent<{
  dashboards: string[];
  categories: string[];
  dataSources: string[];
  settings: string[];
  organisationUnits: INamed[];
}>();

export const addCategory = domain.createEvent<string>();
export const addDataSource = domain.createEvent<string>();
export const setCurrentDashboard = domain.createEvent<IDashboard>();
export const addSection = domain.createEvent<void>();
export const addVisualization2Section = domain.createEvent<void>();
export const deleteSection = domain.createEvent<string>();
export const setCurrentSection = domain.createEvent<ISection>();
export const toggleDashboard = domain.createEvent<boolean>();
export const changeVisualizationDataSource = domain.createEvent<IDataSource>();
export const changeVisualizationType = domain.createEvent<string>();
export const setCurrentVisualization = domain.createEvent<IVisualization>();
export const addPagination = domain.createEvent<{
  [key: string]: number;
}>();

export const changeNumeratorDataSource = domain.createEvent<IDataSource>();
export const changeDenominatorDataSource = domain.createEvent<IDataSource>();
export const addNumeratorExpression = domain.createEvent<IExpression>();
export const addDenominatorExpression = domain.createEvent<IExpression>();
export const removeNumeratorExpression = domain.createEvent<IExpression>();
export const removeDenominatorExpression = domain.createEvent<IExpression>();
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
}>();

export const changeDenominatorDimension = domain.createEvent<{
  id: string;
  what: string;
  type: string;
}>();
