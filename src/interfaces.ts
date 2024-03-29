import type { BoxProps } from "@chakra-ui/react";
import { MakeGenerics } from "@tanstack/react-location";
import type { DataNode as IDataNode } from "antd/es/tree";
import { AxiosInstance } from "axios";
import { OptionBase } from "chakra-react-select";
import { Event } from "effector";

export type Storage = "data-store" | "es";
export type ScreenSize = "xs" | "sm" | "md" | "lg";
export interface IImage {
    id: string;
    src: string;
    alignment:
        | "bottom-left"
        | "top-left"
        | "bottom-right"
        | "top-right"
        | "middle-bottom"
        | "middle-top";
}

export interface IColumn {
    title: string;
    id: string;
}
export interface Option extends OptionBase {
    label: string;
    value: string;
    id?: string;
}
export interface IRow {
    title: string;
    id: string;
}
export interface DataValueAttribute {
    attribute:
        | "name"
        | "description"
        | "dimension"
        | "query"
        | "accessor"
        | "type"
        | "resource";
    value: any;
}
export interface INamed {
    id: string;
    name?: string;
    description?: string;
    order?: string;
}
export interface IDashboardSetting extends INamed {
    defaultDashboard: string;
    template: string;
    storage: Storage;
    templatePadding: string;
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
    type: "DHIS2" | "ELASTICSEARCH" | "API" | "INDEX_DB";
    authentication: Authentication;
    isCurrentDHIS2: boolean;
    indexDb?: { programStage: string };
}
export type Dimension = {
    id: string;
    dimension: string;
    remove?: boolean;
    replace?: boolean;
    label?: string;
    prefix?: string;
    suffix?: string;
    type: string;
    resource: string;
    periodType?: PeriodType;
};
export interface ICategory extends INamed {}
export interface IDimension {
    [key: string]: Dimension;
}
export interface IData extends INamed {
    query?: string;
    expressions?: IExpressions;
    type: "SQL_VIEW" | "ANALYTICS" | "API" | "VISUALIZATION";
    accessor?: string;
    dataDimensions: IDimension;
    dataSource?: string;
    joinTo?: string;
    flatteningOption?: string;
    fromColumn?: string;
    toColumn?: string;
    fromFirst?: boolean;
    includeEmpty?: boolean;
    valueIfEmpty?: string;
    aggregationType?:
        | "SUM"
        | "AVERAGE"
        | "AVERAGE_SUM_ORG_UNIT"
        | "LAST"
        | "LAST_AVERAGE_ORG_UNIT"
        | "COUNT"
        | "STDDEV"
        | "VARIANCE"
        | "MIN"
        | "MAX";
    dividingString?: string;
    divide?: boolean;
}

export interface IIndicator extends INamed {
    numerator?: string;
    denominator?: string;
    factor: string;
    custom: boolean;
    query?: string;
}

export interface IVisualization extends INamed {
    indicators: Array<string>;
    type: string;
    actualType?: string;
    refreshInterval?: number;
    overrides: { [key: string]: any };
    properties: { [key: string]: any };
    group: string;
    expression?: string;
    showTitle?: boolean;
    bg: string;
    needFilter?: boolean;
    show: number;
    rows?: number;
    columns?: number;
    isFullscreenable?: boolean;
    displayTitle?: boolean;
    dataSource?: IDataSource;
}
export interface ISection extends BoxProps {
    id: string;
    title: string;
    visualizations: IVisualization[];
    direction: "row" | "column";
    display: "normal" | "carousel" | "marquee" | "grid";
    carouselOver: string;
    colSpan: number;
    rowSpan: number;
    height: string;
    headerBg: string;
    lg: ReactGridLayout.Layout;
    md: ReactGridLayout.Layout;
    sm: ReactGridLayout.Layout;
    xs: ReactGridLayout.Layout;
    isTemplateArea: boolean;
    spacing?: string;
    isPrintable?: boolean;
    isFullscreenable?: boolean;
    displayTitle?: boolean;
}
export interface IFilter {
    id: string;
    resource: string;
    resourceKey: string;
    parent?: string;
    dashboard?: string;
}

export interface IDashboard extends INamed {
    category?: string;
    filters?: IFilter[];
    sections: ISection[];
    published: boolean;
    isDefault?: boolean;
    refreshInterval: string;
    rows: number;
    columns: number;
    dataSet: string;
    categorization: { [key: string]: any[] };
    availableCategories: any[];
    availableCategoryOptionCombos: any[];
    bg: string;
    targetCategoryCombo: string;
    targetCategoryOptionCombos: any[];
    hasChildren?: boolean;
    nodeSource: Partial<{
        resource: string;
        fields: string;
        search: string;
        subSearch: string;
    }>;
    tag: string;
    type: "fixed" | "dynamic";
    excludeFromList: boolean;
    child?: string;
    spacing: number;
    padding: number;
}
export interface Pagination {
    total: number;
    page: number;
    pageSize: number;
}
export interface DataNode extends IDataNode {
    id?: string;
    value?: string;
    pId: string;
    children?: DataNode[];
    type?: string;
    nodeSource?: { [key: string]: any };
    hasChildren?: boolean;
    bg?: string;
    actual?: string;
    parent?: { [key: string]: any };
    order?: string;
    metadata?: Partial<{
        rows: number;
        columns: number;
        rowsPerPage: number;
    }>;
    filter?: string;
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
    selectedPeriods: Period[];
    onChange: (periods: Period[], remove: boolean) => void;
};
export interface IStore {
    showSider: boolean;
    showFooter: boolean;
    organisations: string[];
    periods: Period[];
    groups: string[];
    levels: string[];
    expandedKeys: React.Key[];
    selectedKeys: React.Key[];
    selectedCategory: string;
    selectedDashboard: string;
    isAdmin: boolean;
    hasDashboards: boolean;
    defaultDashboard: string;
    currentPage: string;
    logo: string;
    systemId: string;
    systemName: string;
    checkedKeys:
        | { checked: React.Key[]; halfChecked: React.Key[] }
        | React.Key[];
    minSublevel: number;
    maxLevel: number;
    instanceBaseUrl: string;
    isNotDesktop: boolean;
    isFullScreen: boolean;
    refresh: boolean;
    themes: string[];
    dataElements: IDataElement[];
    rows: any[];
    columns: any[];
    originalColumns: any[];
    version: string;
    dataElementGroups: string[];
    dataElementGroupSets: string[];
}

export type IndicatorProps = {
    denNum?: IData;
    onChange: Event<Dimension>;
    dataSourceType?: string;
    changeQuery?: Event<DataValueAttribute>;
};

export type LocationGenerics = MakeGenerics<{
    LoaderData: {
        indicators: IIndicator[];
        dashboards: IDashboard[];
        dataSources: IDataSource[];
        categories: ICategory[];
        indicator: IIndicator;
        category: ICategory;
        dataSource: IDataSource;
        dataSourceOptions: Option[];
    };
    Params: {
        indicatorId: string;
        categoryId: string;
        dataSourceId: string;
        dashboardId: string;
        visualizationQueryId: string;
        templateId: string;
        presentationId: string;
        sectionId: string;
        reportId: string;
    };
    Search: {
        category: string;
        periods: string[];
        levels: string[];
        groups: string[];
        organisations: string[];
        dataSourceId: string;
        action: "create" | "update" | "view";
        display: "report" | "dashboard";
        type: "fixed" | "dynamic";
        optionSet: string;
        affected: string;
        downloadable: boolean;
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
    data?: any;
    dimensions?: { [key: string]: string[] };
    metadata?: { [key: string]: string };
    others?: { [key: string]: any };
}

export interface Threshold {
    id: string;
    value: number;
    color: string;
}

export interface IDataElement {
    id: string;
    code: string;
    name: string;
    intervention: string;
    interventionCode: string;
    subKeyResultArea: string;
    subKeyResultAreaCode: string;
    keyResultArea: string;
    keyResultAreaCode: string;
    theme: string;
    themeCode: string;
    programCode: string;
    program: string;
    degsId: string;
    degsName: string;
    degsCode: string;
    degId: string;
}

export interface IExpanded {
    id: string;
    name: string;
}

export interface SystemInfo {
    id: string;
    systemId: string;
    systemName: string;
    instanceBaseUrl: string;
}

export interface DexieStore {}

type PlaylistItem = {
    id: string;
    type: "dashboard" | "section" | "visualization";
    dashboard?: string;
    section?: string;
};
export interface Playlist {
    items: Array<PlaylistItem>;
    interval: number;
}

export interface IPagination {
    totalDataElements: number;
    totalSQLViews: number;
    totalIndicators: number;
    totalProgramIndicators: number;
    totalOrganisationUnitLevels: number;
    totalOrganisationUnitGroups: number;
    totalOrganisationUnitGroupSets: number;
    totalDataElementGroups: number;
    totalDataElementGroupSets: number;
}

export interface IExpressionValue {
    attribute: string;
    value: string;
    isGlobal: boolean;
}

export type VizProps = {
    visualization: IVisualization;
    attribute: string;
    title?: string;
};

export type Column = {
    label: string;
    value: string;
    span: number;
    actual: string;
    position: number;
    key: string;
};

export type RelativePeriodType =
    | "DAILY"
    | "WEEKLY"
    | "BIWEEKLY"
    | "WEEKS_THIS_YEAR"
    | "MONTHLY"
    | "BIMONTHLY"
    | "QUARTERLY"
    | "SIXMONTHLY"
    | "FINANCIAL"
    | "YEARLY";

export type FixedPeriodType =
    | "DAILY"
    | "WEEKLY"
    | "WEEKLYWED"
    | "WEEKLYTHU"
    | "WEEKLYSAT"
    | "WEEKLYSUN"
    | "BIWEEKLY"
    | "MONTHLY"
    | "BIMONTHLY"
    | "QUARTERLY"
    | "QUARTERLYNOV"
    | "SIXMONTHLY"
    | "SIXMONTHLYAPR"
    | "SIXMONTHLYNOV"
    | "YEARLY"
    | "FYNOV"
    | "FYOCT"
    | "FYJUL"
    | "FYAPR";

export type FixedPeriod = {
    id: string;
    iso?: string;
    name: string;
    startDate: string;
    endDate: string;
};

export type PeriodType = "fixed" | "relative" | "range";
export interface Period extends Option {
    startDate?: string;
    endDate?: string;
    type: PeriodType;
}

export type IData2 = Omit<IData, "joinTo" | "dataSource"> &
    Partial<{
        joinTo: IData2;
        dataSource: IDataSource;
    }>;
export type IIndicator2 = Omit<IIndicator, "numerator" | "denominator"> &
    Partial<{
        numerator: IData2;
        denominator: IData2;
    }>;

export type IVisualization2 = Omit<IVisualization, "indicators"> & {
    indicators: Array<IIndicator2>;
};

export interface MetadataAPI {
    api: AxiosInstance | undefined | null;
    isCurrentDHIS2: boolean | undefined | null;
}

export type VisualizationItems = Array<{
    items: Array<{
        name: string;
        dimensionItemType: string;
        displayShortName: string;
        displayName: string;
        id: string;
    }>;
    dimension: string;
}>;

export type AttributeProps<T> = {
    title: string;
    attribute: keyof T;
    obj: T;
    func: Event<{ attribute: keyof T; value: any }>;
    direction?: "row" | "column";
};

export interface IPresentation extends INamed {
    items: DataNode[];
    speed: number;
}
export interface IPage extends INamed {
    items: Array<DataNode>;
}

export type Size = "A3" | "A4" | "A5" | "legal" | "letter";
export type UserGroup = INamed & { displayName: string };
export interface User extends INamed {
    email: string;
    username: string;
    displayName: string;
}

export interface IReport extends INamed {
    pages: Array<IPage>;
    size: Size;
    emails: string;
    isLandscape: boolean;
    schedule: string;
    basedOnUserOrganization: boolean;
    additionalDays: number;
    rowsPerPage: number;
}

export interface IUserGroup extends INamed {
    email: string[];
}

export interface CategoryCombo {
    categories: Category[];
    categoryOptionCombos: CategoryOptionCombo[];
}

export interface CategoryOptionCombo {
    id: string;
    categoryOptions: CategoryOption2[];
}

export interface CategoryOption2 {
    id: string;
}

export interface Category {
    name: string;
    id: string;
    shortName: string;
    categoryOptions: CategoryOption[];
}

export interface CategoryOption {
    name: string;
    id: string;
    endDate?: string;
    startDate?: string;
}
