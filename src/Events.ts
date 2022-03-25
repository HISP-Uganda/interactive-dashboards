import { domain } from "./Domain";
import { IDashboard, INamed, IDataSource, ISection, IVisualization } from "./interfaces";

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
