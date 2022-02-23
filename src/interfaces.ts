import { Layout } from "react-grid-layout";

export interface Named {
  id: string;
  name?: string;
  description?: string;
}

export interface Category extends Named {}
export interface Data {
  dataSource:
    | "DHIS2-SQL-VIEW"
    | "DHIS2-INDICATOR"
    | "DHIS2-DATA-ELEMENT"
    | "OTHER";
}

export interface Numerator extends Data {}
export interface Denominator extends Data {}

export interface Indicator extends Named {
  numerator: Numerator;
  denominator: Denominator;
  factor: number;
}

export interface Visualization extends Named {
  indicator: Indicator;
  type: string;
  ignoreFilter: boolean;
  refreshInterval: number;
}

export interface Section extends Named {
  layout: {
    // xxl: Layout;
    // lg: Layout;
    md: Layout;
    // sm: Layout;
    // xs: Layout;
    // xxs: Layout;
  };
  visualizations?: Visualization[];
}

export interface Filter {}

export interface Dashboard extends Named {
  category?: string;
  filters?: string[];
  sections: Section[];
  isDefault?: boolean;
}

export interface Store {
  categories: string[];
  dashboards: string[];
  visualizations: string[];
  category: string;
  dashboard: Dashboard;
  section: string;
  visualization: string;
  organisationUnits: Named[];
}
