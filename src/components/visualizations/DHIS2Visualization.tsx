import React, { useState, useEffect } from "react";
import { useD2 } from "@dhis2/app-runtime-adapter-d2";
import { Text } from "@chakra-ui/react";
import VisualizationPlugin from "@dhis2/data-visualizer-plugin";
import LoadingIndicator from "../LoadingIndicator";

import { IVisualization } from "../../interfaces";
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
                        fields: "access,aggregationType,axes,colSubTotals,colTotals,colorSet,columns[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],completedOnly,created,cumulative,cumulativeValues,description,digitGroupSeparator,displayDensity,displayDescription,displayName,displayShortName,favorite,favorites,filters[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],fixColumnHeaders,fixRowHeaders,fontSize,fontStyle,hideEmptyColumns,hideEmptyRowItems,hideEmptyRows,hideSubtitle,hideTitle,href,id,interpretations[id,created],lastUpdated,lastUpdatedBy,legend[showKey,style,strategy,set[id,name,displayName,displayShortName]],measureCriteria,name,noSpaceBetweenColumns,numberType,outlierAnalysis,parentGraphMap,percentStackedValues,publicAccess,regression,regressionType,reportingParams,rowSubTotals,rowTotals,rows[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],series,seriesKey,shortName,showData,showDimensionLabels,showHierarchy,skipRounding,sortOrder,subscribed,subscribers,subtitle,timeField,title,topLimit,translations,type,user[name,displayName,displayShortName,userCredentials[username]],userAccesses,userGroupAccesses,yearlySeries,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!code,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!externalAccess,!filterDimensions,!itemOrganisationUnitGroups,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!periods,!programIndicatorDimensions,!relativePeriods,!rowDimensions,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren",
                    }
                );
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
    if (viz !== undefined)
        return (
            <VisualizationPlugin
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
            />
        );
    return null;
}
