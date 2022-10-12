import { MakeGenerics } from "@tanstack/react-location";
import { OptionBase } from "chakra-react-select";
import { Event } from "effector";

export interface Image {
  id: string;
  src: string;
  alignment: string;
}
export interface DataValueAttribute {
  attribute: "name" | "description" | "type" | "query" | "accessor";
  value: any;
}
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
export interface IExpressions {
  [key: string]: {
    value: any;
    isGlobal?: boolean;
  };
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
  query?: string;
  expressions?: IExpressions;
  type: "SQL_VIEW" | "ANALYTICS" | "OTHER";
  accessor?: string;
  dataDimensions: IDimension;
}

export interface IIndicator extends INamed {
  numerator?: IData;
  denominator?: IData;
  factor: string;
  dataSource?: string;
  useInBuildIndicators: boolean;
  query?: string;
}

export interface IVisualization extends INamed {
  indicator: string;
  type: string;
  refreshInterval?: number;
  overrides: { [key: string]: any };
  properties: { [key: string]: any };
  group: string;
  expression?: string;
}
export interface ISection {
  id: string;
  title: string;
  visualizations: IVisualization[];
  direction: "row" | "column";
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch"
    | "start"
    | "end"
    | "baseline";
  display: "normal" | "carousel" | "marquee" | "grid";
  carouselOver: string;
  colSpan: number;
  rowSpan: number;
  images: Image[];
  isBottomSection: boolean;
  bg: string;
}

export interface IFilter {}

export interface IDashboard extends INamed {
  category?: string;
  filters?: string[];
  sections: ISection[];
  published: boolean;
  isDefault?: boolean;
  showSider: boolean;
  showTop: boolean;
  refreshInterval: string;
  rows: number;
  columns: number;
  dataSet: string;
  categorization: { [key: string]: any[] };
  availableCategories: any[];
  availableCategoryOptionCombos: any[];
  bottomSection: ISection;
  bg: string;
  targetCategoryCombo: string;
  targetCategoryOptionCombos: any[];
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
  id?: string;
}

export type Item = {
  id: string;
  name: string;
};

export type PickerProps = {
  selectedPeriods: Item[];
  onChange: (periods: Item[]) => void;
};
export interface IStore {
  showSider: boolean;
  organisations: React.Key[];
  periods: Item[];
  groups: string[];
  levels: string[];
  expandedKeys: React.Key[];
  selectedCategory: string;
  selectedDashboard: string;
  isAdmin: boolean;
  hasDashboards: boolean;
  defaultDashboard: string;
  currentPage: string;
  logo: string;
}

export type IndicatorProps = {
  denNum?: IData;
  onChange: Event<{
    id: string;
    what: string;
    type: string;
    remove?: boolean;
    replace?: boolean;
    label?: string;
  }>;
  dataSourceType?: string;
  changeQuery?: Event<DataValueAttribute>;
};

export type FormGenerics = MakeGenerics<{
  Search: {
    edit?: boolean;
    category: string;
    periods: string[];
    levels: string[];
    groups: string[];
    organisations: string[];
  };
}>;

export type OUTreeProps = {
  units: DataNode[];
  levels: Option[];
  groups: Option[];
};
export interface ChartProps {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
  section: ISection;
}
