import { Text } from "@chakra-ui/react";
import { fromPairs } from "lodash";
import React from "react";
import { ISection, IVisualization } from "../../interfaces";
import { useDHIS2Visualization } from "../../Queries";
import LoadingIndicator from "../LoadingIndicator";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import BoxPlot from "./BoxPlot";
import BubbleMaps from "./BubbleMaps";
import GaugeGraph from "./GaugeGraph";
import LineGraph from "./LineGraph";
import MapChartLeaflet from "./MapChartLeaflet";
import MultipleChartTypes from "./MultipleChartTypes";
import PieChart from "./PieChart";
import RadarGraph from "./RadarGraph";
import ScatterPlot from "./ScatterPlot";
import SingleValue from "./SingleValue";
import StackedArea from "./StackedArea";
import SunburstChart from "./SunburstChart";
import Tables from "./Tables";
import TextVisualisation from "./TextVisualisation";

const getVisualization = (
    visualization: IVisualization,
    data: any,
    section: ISection
) => {
    const dataProperties = fromPairs(
        Object.entries(visualization.properties || {}).filter(([key]) =>
            key.startsWith("data")
        )
    );
    const layoutProperties = fromPairs(
        Object.entries(visualization.properties || {}).filter(([key]) =>
            key.startsWith("layout")
        )
    );
    const otherProperties = fromPairs(
        Object.entries(visualization.properties || {}).filter(
            ([key]) => !key.startsWith("layout") && !key.startsWith("data")
        )
    );

    const allTypes: { [key: string]: React.ReactNode } = {
        single: (
            <SingleValue
                {...otherProperties}
                data={data}
                section={section}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        bar: (
            <BarGraph
                {...otherProperties}
                data={data}
                section={section}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        pie: (
            <PieChart
                {...otherProperties}
                data={data}
                section={section}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        map: (
            <MapChartLeaflet
                {...otherProperties}
                data={data}
                section={section}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        line: (
            <LineGraph
                {...otherProperties}
                data={data}
                section={section}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        sunburst: (
            <SunburstChart
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        gauge: (
            <GaugeGraph
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        area: (
            <AreaGraph
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        radar: (
            <RadarGraph
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        bubblemaps: (
            <BubbleMaps
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        stackedarea: (
            <StackedArea
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        multiplecharts: (
            <MultipleChartTypes
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        tables: (
            <Tables
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        boxplot: (
            <BoxPlot
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        scatterplot: (
            <ScatterPlot
                {...otherProperties}
                section={section}
                data={data}
                visualization={visualization}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),

        text: (
            <TextVisualisation
                visualization={visualization}
                section={section}
            />
        ),
    };
    return allTypes[visualization.properties["type"]];
};
export default function DHIS2Visualization({
    visualization,
    section,
}: {
    visualization: IVisualization;
    section: ISection;
}) {
    const { isLoading, isError, data, error, isSuccess } =
        useDHIS2Visualization(visualization);

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess &&
                data &&
                getVisualization(data.visualization, data.data, section)}
            {isError && <Text>{error?.message}</Text>}
        </>
    );
}
