import { domain } from "./Domain";
import { IDashboard, INamed, IDataSource } from "./interfaces";

export const loadDefaults = domain.createEvent<{
  dashboards: string[];
  categories: string[];
  organisationUnits: INamed[];
  dataSources: IDataSource[];
}>();

export const addCategory = domain.createEvent<string>();
export const addDataSource = domain.createEvent<string>();
export const addDashboard = domain.createEvent<IDashboard>();
export const addSection = domain.createEvent<void>();
export const deleteSection = domain.createEvent<string>();
export const activateSection = domain.createEvent<string>();
export const toggleDashboard = domain.createEvent<boolean>();
