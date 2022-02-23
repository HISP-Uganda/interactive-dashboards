import { domain } from "./Domain";
import {
  Dashboard,
  Category,
  Section,
  Visualization,
  Named,
} from "./interfaces";

export const createDashboard = domain.createEvent<Dashboard>();
export const loadDefaults = domain.createEvent<{
  dashboards: string[];
  categories: string[];
  visualizations: string[];
  organisationUnits: Named[];
}>();

export const addCategory = domain.createEvent<string>();
export const addDashboard = domain.createEvent<Dashboard>();
export const addSection = domain.createEvent<void>();
export const activateSection = domain.createEvent<string>();
