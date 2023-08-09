import React, { useState, useEffect } from "react";
import { useD2 } from "@dhis2/app-runtime-adapter-d2";
import { Text } from "@chakra-ui/react";
import VisualizationPlugin from "@dhis2/data-visualizer-plugin";

import LoadingIndicator from "../LoadingIndicator";

import { IVisualization } from "../../interfaces";
import {
    loadExternalScript,
    getVisualizationContainerDomId,
} from "./loadExternalScripts";
import { getAnalyticsQuery } from "../../utils/utils";

export const VISUALIZATION = "VISUALIZATION";
export const REPORT_TABLE = "REPORT_TABLE";
export const CHART = "CHART";
export const MAP = "MAP";
export const EVENT_REPORT = "EVENT_REPORT";
export const EVENT_CHART = "EVENT_CHART";
export const EVENT_VISUALIZATION = "EVENT_VISUALIZATION";
export const APP = "APP";
export const REPORTS = "REPORTS";
export const RESOURCES = "RESOURCES";
export const USERS = "USERS";
export const MESSAGES = "MESSAGES";
export const TEXT = "TEXT";
export const SPACER = "SPACER";
export const PAGEBREAK = "PAGEBREAK";
export const PRINT_TITLE_PAGE = "PRINT_TITLE_PAGE";

const DOMAIN_TYPE_AGGREGATE = "AGGREGATE";
const DOMAIN_TYPE_TRACKER = "TRACKER";

// Item type map
export const itemTypeMap: { [key: string]: any } = {
    [VISUALIZATION]: {
        id: VISUALIZATION,
        endPointName: "visualizations",
        dataStatisticsName: "VISUALIZATION_VIEW",
        propName: "visualization",
        pluralTitle: "Visualizations",
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-data-visualizer/#/${id}`,
        appName: "Data Visualizer",
        appKey: "data-visualizer",
        defaultItemCount: 10,
    },
    [REPORT_TABLE]: {
        id: REPORT_TABLE,
        endPointName: "visualizations",
        dataStatisticsName: "REPORT_TABLE_VIEW",
        propName: "visualization",
        pluralTitle: "Pivot tables",
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-data-visualizer/#/${id}`,
        appName: "Data Visualizer",
    },
    [CHART]: {
        id: CHART,
        endPointName: "visualizations",
        propName: "visualization",
        dataStatisticsName: "CHART_VIEW",
        pluralTitle: "Charts",
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-data-visualizer/#/${id}`,
        appName: "Data Visualizer",
    },
    [MAP]: {
        id: MAP,
        endPointName: "maps",
        dataStatisticsName: "MAP_VIEW",
        propName: "map",
        pluralTitle: "Maps",
        domainType: DOMAIN_TYPE_AGGREGATE,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-maps/?id=${id}`,
        appName: "Maps",
    },
    [EVENT_REPORT]: {
        id: EVENT_REPORT,
        endPointName: "eventReports",
        propName: "eventReport",
        pluralTitle: "Event reports",
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-event-reports/?id=${id}`,
        appName: "Event Reports",
    },
    [EVENT_CHART]: {
        id: EVENT_CHART,
        endPointName: "eventCharts",
        propName: "eventChart",
        pluralTitle: "Event charts",
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        appUrl: (id: string) => `dhis-web-event-visualizer/?id=${id}`,
        appName: "Event Visualizer",
    },
    [EVENT_VISUALIZATION]: {
        id: EVENT_VISUALIZATION,
        endPointName: "eventVisualizations",
        propName: "eventVisualization",
        pluralTitle: "Line lists",
        domainType: DOMAIN_TYPE_TRACKER,
        isVisualizationType: true,
        appUrl: (id: string) => `api/apps/line-listing/index.html#/${id}`,
        appName: "Line Listing",
        appKey: "line-listing",
    },
    [APP]: {
        endPointName: "apps",
        propName: "appKey",
        pluralTitle: "Apps",
    },
    [REPORTS]: {
        id: REPORTS,
        endPointName: "reports",
        propName: "reports",
        pluralTitle: "Reports",
        appUrl: (id: string, type: string) => {
            switch (type) {
                case "HTML":
                    return `dhis-web-reports/#/standard-report/view/${id}`;

                case "JASPER_REPORT_TABLE":
                case "JASPER_JDBC":
                default:
                    return `api/reports/${id}/data.pdf?t=${new Date().getTime()}`;
            }
        },
    },
    [RESOURCES]: {
        id: RESOURCES,
        endPointName: "resources",
        propName: "resources",
        pluralTitle: "Resources",
        appUrl: (id: string) => `api/documents/${id}/data`,
    },
    [USERS]: {
        id: USERS,
        endPointName: "users",
        propName: "users",
        pluralTitle: "Users",
        appUrl: (id: string) =>
            `dhis-web-dashboard-integration/profile.action?id=${id}`,
    },
    [TEXT]: {
        id: TEXT,
        propName: "text",
    },
    [MESSAGES]: {
        propName: "messages",
    },
    [SPACER]: {
        propName: "text",
    },
    [PAGEBREAK]: {
        propName: "text",
    },
    [PRINT_TITLE_PAGE]: {
        propName: "text",
    },
};

//external plugins
const itemTypeToGlobalVariable: { [key: string]: any } = {
    [EVENT_REPORT]: "eventReportPlugin",
    [EVENT_CHART]: "eventChartPlugin",
};

const itemTypeToScriptPath: { [key: string]: string } = {
    [EVENT_REPORT]: "/dhis-web-event-reports/eventreport.js",
    [EVENT_CHART]: "/dhis-web-event-visualizer/eventchart.js",
};

export const getPlugin = async (type: string) => {
    if (hasIntegratedPlugin(type)) {
        return true;
    }
    return itemTypeToGlobalVariable[type];

    // return await global[pluginName];
};

const fetchPlugin = async (type: string, baseUrl: string) => {
    const globalName = itemTypeToGlobalVariable[type];
    // if (global[globalName]) {
    //     return global[globalName];
    // }

    const scripts = [];

    if (type === EVENT_REPORT || type === EVENT_CHART) {
        if (process.env.NODE_ENV === "production") {
            scripts.push("./vendor/babel-polyfill-6.26.0.min.js");
            scripts.push("./vendor/jquery-3.3.1.min.js");
            scripts.push("./vendor/jquery-migrate-3.0.1.min.js");
        } else {
            scripts.push("./vendor/babel-polyfill-6.26.0.js");
            scripts.push("./vendor/jquery-3.3.1.js");
            scripts.push("./vendor/jquery-migrate-3.0.1.js");
        }
    }

    scripts.push(baseUrl + itemTypeToScriptPath[type]);

    const scriptsPromise = await Promise.all(scripts.map(loadExternalScript));

    // global[globalName] = scriptsPromise;
    return scriptsPromise;
};

export const pluginIsAvailable = (type: string, d2: any) =>
    hasIntegratedPlugin(type) ||
    Boolean(getPluginLaunchUrl(type, d2, "")) ||
    Boolean(itemTypeToGlobalVariable[type]);

const loadPlugin = async ({
    type,
    config,
    credentials,
    d2,
}: {
    type: string;
    config: any;
    credentials: any;
    d2: any;
}) => {
    if (!pluginIsAvailable(type, d2)) {
        return;
    }

    const plugin: any = await fetchPlugin(type, credentials.baseUrl);

    if (!(plugin && plugin.load)) {
        return;
    }

    plugin.url = credentials.baseUrl;
    plugin.loadingIndicator = true;
    plugin.dashboard = true;
    if (credentials.auth) {
        plugin.auth = credentials.auth;
    }
    plugin.load(config);
};

export const load = async (
    item: any,
    visualization: any,
    {
        credentials,
        activeType,
        d2,
        options = {},
    }: { credentials: any; activeType: string; d2: any; options: any }
) => {
    const config = {
        ...visualization,
        ...options,
        el: getVisualizationContainerDomId(item.id),
    };

    const type = activeType || item.type;
    await loadPlugin({ type, config, credentials, d2 });
};

export const unmount = async (item: any, activeType: string) => {
    const plugin = await getPlugin(activeType);

    if (plugin && plugin.unmount) {
        plugin.unmount(getVisualizationContainerDomId(item.id));
    }
};

const hasIntegratedPlugin = (type: string) =>
    [CHART, REPORT_TABLE, VISUALIZATION, MAP].includes(type);

export const getPluginLaunchUrl = (type: string, d2: any, baseUrl: string) => {
    const apps = d2.system.installedApps;
    const appKey = itemTypeMap[type].appKey;

    const appDetails = appKey && apps.find((app: any) => app.key === appKey);

    if (appDetails) {
        return appDetails.pluginLaunchUrl;
    }

    if (hasIntegratedPlugin(type)) {
        switch (type) {
            case CHART:
            case REPORT_TABLE:
            case VISUALIZATION: {
                return `${baseUrl}/dhis-web-data-visualizer/plugin.html`;
            }
            case MAP: {
                return `${baseUrl}/dhis-web-maps/plugin.html`;
            }
        }
    }
};
export default function DHIS2Visualization({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const { d2 } = useD2();

    const [viz, setViz] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const initialize = async () => {
        try {
            if (d2 && visualization.properties["visualization"] !== undefined) {
                setLoading(() => true);
                const api = d2.Api.getApi();
                const data = await api.get(
                    `visualizations/${visualization.properties["visualization"]}`,
                    {
                        fields: "aggregationType,axes,colSubTotals,colTotals,colorSet,columns[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],completedOnly,created,cumulative,cumulativeValues,description,digitGroupSeparator,displayDensity,displayDescription,displayName,displayShortName,favorite,favorites,filters[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],fixColumnHeaders,fixRowHeaders,fontSize,fontStyle,hideEmptyColumns,hideEmptyRowItems,hideEmptyRows,hideSubtitle,hideTitle,href,id,interpretations[id,created],lastUpdated,lastUpdatedBy,legend[showKey,style,strategy,set[id,name,displayName,displayShortName]],measureCriteria,name,noSpaceBetweenColumns,numberType,outlierAnalysis,parentGraphMap,percentStackedValues,publicAccess,regression,regressionType,reportingParams,rowSubTotals,rowTotals,rows[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],series,seriesKey,shortName,showData,showDimensionLabels,showHierarchy,skipRounding,sortOrder,subscribed,subscribers,subtitle,timeField,title,topLimit,translations,type,user[name,displayName,displayShortName,userCredentials[username]],userAccesses,userGroupAccesses,yearlySeries,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!code,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!externalAccess,!filterDimensions,!itemOrganisationUnitGroups,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!periods,!programIndicatorDimensions,!relativePeriods,!rowDimensions,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren",
                    }
                );
                const params = getAnalyticsQuery(data);
                const realData = await api.get(`analytics.json?${params}`);
                setViz(() => data);
                setLoading(() => false);
            }
        } catch (error) {
            setError(() => error.message);
        }
    };
    useEffect(() => {
        initialize();
        return () => {};
    }, [visualization.properties["visualization"], viz?.id, d2]);

    if (error) return <Text>{error}</Text>;
    if (loading) return <LoadingIndicator />;
    if (viz !== undefined) return <pre>{JSON.stringify(viz, null, 2)}</pre>;
    return null;
}

{
    /* <VisualizationPlugin
    d2={d2}
    visualization={viz}
    forDashboard={true}
    style={{
        width: "700px",
        height: "700px",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: "yellow",
    }}
/>; */
}
