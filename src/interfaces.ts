import { Layout } from "react-grid-layout";
import { Event } from "effector";

export interface INamed {
  id: string;
  name?: string;
  description?: string;
}
export interface Authentication {
  username: string;
  password: string;
  url: string;
}
export interface IExpression {
  id: string;
  key: string;
  value: string;
  isGlobal: boolean;
}
export interface IDataSource extends INamed {
  type: "DHIS2" | "ELASTICSEARCH" | "API";
  authentication: Authentication;
  isCurrentDHIS2: boolean;
}

export interface ICategory extends INamed {}
export interface IData extends INamed {
  dataSource: IDataSource | undefined;
  expressions?: IExpression[];
  type: "SQL_VIEW" | "ANALYTICS" | "OTHER";
  typeId?: string;
  dataDimensions?: {
    [key: string]: {
      type: string;
      what: string;
    };
  };
}

export interface IIndicator extends INamed {
  numerator: IData;
  denominator: IData;
  factor: string;
}

export interface IVisualization extends INamed {
  indicator?: IIndicator;
  type: string;
  ignoreFilter?: boolean;
  refreshInterval?: number;
  dataSource?: IDataSource;
}
export interface ISection extends INamed {
  layout: {
    // xxl: Layout;
    // lg: Layout;
    md: Layout;
    // sm: Layout;
    // xs: Layout;
    // xxs: Layout;
  };
  visualizations: IVisualization[];
}

export interface IFilter {}

export interface IDataSource extends INamed {}
export interface IDashboard extends INamed {
  category?: string;
  filters?: string[];
  sections: ISection[];
  isDefault?: boolean;
  published: boolean;
}
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
}

export interface IStore {
  categories: string[];
  dashboards: string[];
  dataSources: string[];
  visualizations: string[];
  settings: string[];
  category: string;
  dashboard: IDashboard;
  section: ISection | undefined;
  visualization: IVisualization | undefined;
  organisationUnits: INamed[];
  hasDashboards: boolean;
  hasDefaultDashboard: boolean;
  paginations: { [key: string]: number };
  indicator: IIndicator;
}


export type IndicatorProps = {
  denNum: IData;
  onChange: Event<{ id: string; what: string; type: string }>;
};