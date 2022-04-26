import { OptionBase } from "chakra-react-select";
import { Event } from "effector";
import { Layout, Layouts } from "react-grid-layout";
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
export interface IDimension {
  [key: string]: {
    type: string;
    what: string;
    label?: string;
  };
}
export interface IData extends INamed {
  expressions?: IExpression[];
  type: "SQL_VIEW" | "ANALYTICS" | "OTHER";
  dataDimensions: IDimension;
}

export interface IIndicator extends INamed {
  numerator: IData;
  denominator: IData;
  factor: string;
  dataSource?: string;
  useInBuildIndicators: boolean;
}

export interface IVisualization extends INamed {
  indicators: string[];
  type: string;
  refreshInterval?: number;
}
export interface ISection extends Layout {
  title: string;
  visualizations: IVisualization[];
}

export interface IFilter {}

export interface IDashboard extends INamed {
  category?: string;
  filters?: string[];
  sections: ISection[];
  published: boolean;
  isDefault?: boolean;
  layouts: Layouts;
  itemHeight: number;
  showSider: boolean;
  showTop: boolean;
  mode: "edit" | "view";
}
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
}
export interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

export interface Option extends OptionBase {
  label: string;
  value: string;
}

export interface IStore {
  categories: string[];
  dashboards: string[];
  dataSources: string[];
  visualizations: string[];
  settings: string[];
  organisationUnits: DataNode[];
  showSider:boolean;
  hasDashboards: boolean;
  hasDefaultDashboard: boolean;
  paginations: { [key: string]: number };
}

export type IndicatorProps = {
  denNum: IData;
  onChange: Event<{
    id: string;
    what: string;
    type: string;
    remove?: boolean;
    label?: string;
  }>;
};
