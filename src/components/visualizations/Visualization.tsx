import { Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { ISection, IVisualization, LocationGenerics } from "../../interfaces";
import { useVisualization } from "../../Queries";
import {
    $dashboard,
    $globalFilters,
    $visualizationData,
    $calculated,
} from "../../Store";
import { deriveSingleValues } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import BoxPlot from "./BoxPlot";
import BubbleMaps from "./BubbleMaps";
import CategoryList from "./CategoryList";
import DashboardList from "./DashboardList";
import DashboardTitle from "./DashboardTitle";
import DashboardTree from "../DashboardTree";
import Filters from "./Filters";
import FunnelGraph from "./FunnelGraph";
import GaugeGraph from "./GaugeGraph";
import Histogram from "./Histogram";
import ImageVisualization from "./ImageVisualization";
import LineGraph from "./LineGraph";
import MapChartLeaflet from "./MapChartLeaflet";
import MultipleChartTypes from "./MultipleChartTypes";
import OptionSet from "./OptionSet";
import PieChart from "./PieChart";
import RadarGraph from "./RadarGraph";
import ScatterPlot from "./ScatterPlot";
import SingleValue from "./SingleValue";
import StackedArea from "./StackedArea";
import SunburstChart from "./SunburstChart";
import Tables from "./Tables";
import TreeMaps from "./TreeMaps";
import { useSearch } from "@tanstack/react-location";
import TextVisualisation from "./TextVisualisation";
import ClockVisualisation from "./ClockVisualisation";
import HeatMap from "./HeatMap";

type VisualizationProps = {
    visualization: IVisualization;
    section: ISection;
};

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

    const allTypes: any = {
        single: (
            <SingleValue
                data={data}
                section={section}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        bar: (
            <BarGraph
                data={data}
                section={section}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        pie: (
            <PieChart
                data={data}
                section={section}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        map: (
            <MapChartLeaflet
                data={data}
                section={section}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        line: (
            <LineGraph
                data={data}
                section={section}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        sunburst: (
            <SunburstChart
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
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
        histogram: (
            <Histogram
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
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        radar: (
            <RadarGraph
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        bubblemaps: (
            <BubbleMaps
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        funnelplot: (
            <FunnelGraph
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        stackedarea: (
            <StackedArea
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        multiplecharts: (
            <MultipleChartTypes
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        treemaps: (
            <TreeMaps
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        tables: (
            <Tables
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        boxplot: (
            <BoxPlot
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        scatterplot: (
            <ScatterPlot
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        dashboardList: <DashboardList />,
        dashboardTree: <DashboardTree />,
        categoryList: <CategoryList />,
        imageVisualization: (
            <ImageVisualization
                section={section}
                data={data}
                visualization={visualization}
                {...otherProperties}
                layoutProperties={layoutProperties}
                dataProperties={dataProperties}
            />
        ),
        filters: <Filters />,
        dashboardTitle: <DashboardTitle />,
        optionSet: (
            <OptionSet visualization={visualization} section={section} />
        ),
        text:
            (
                <TextVisualisation visualization={visualization} section={section} />
            ),
        clock: (
            <ClockVisualisation visualization={visualization} section={section} />
        ),
        heatmap: (
            <HeatMap visualization={visualization} section={section} />
        ),
    };
    return allTypes[visualization.type];
};

const Visualization = ({ visualization, section }: VisualizationProps) => {
    const search = useSearch<LocationGenerics>();
    const globalFilters = useStore($globalFilters);
    const dashboard = useStore($dashboard);
    const calculated = useStore($calculated);
    const { affected, optionSet } = search;

    const { isLoading, isSuccess, data, isError, error } = useVisualization(
        visualization,
        dashboard.refreshInterval,
        globalFilters,
        affected && optionSet ? { [affected]: optionSet } : {}
    );
    return (
        <>
            {visualization.expression &&
                getVisualization(
                    visualization,
                    deriveSingleValues(calculated, visualization.expression),
                    section
                )}
            {!visualization.expression && (
                <>
                    {isLoading && <LoadingIndicator />}
                    {isSuccess &&
                        getVisualization(visualization, data, section)}
                    {isError && <Text>{JSON.stringify(error)}</Text>}
                </>
            )}
        </>
    );
};

export default Visualization;
