import { domain } from "./Domain";
import { IDashboard, INamed } from "./interfaces";

export const createDashboard = domain.createEvent<IDashboard>();
export const loadDefaults = domain.createEvent<{
  dashboards: string[];
  categories: string[];
  visualizations: string[];
  organisationUnits: INamed[];
}>();

export const addCategory = domain.createEvent<string>();
export const addDashboard = domain.createEvent<IDashboard>();
export const addSection = domain.createEvent<void>();
export const deleteSection = domain.createEvent<string>();
export const activateSection = domain.createEvent<string>();
