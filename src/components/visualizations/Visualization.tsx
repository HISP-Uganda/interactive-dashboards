import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs, isEmpty } from "lodash";
import { ISection, IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import {
    $dashboard,
    $dataSources,
    $globalFilters,
    $indicators,
    $visualizationData,
} from "../../Store";
import { deriveSingleValues } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import BoxPlot from "./BoxPlot";
import BubbleMaps from "./BubbleMaps";
import CategoryList from "./CategoryList";
import DashboardList from "./DashboardList";
import DashboardTree from "./DashboardTree";
import Filters from "./Filters";
import FunnelGraph from "./FunnelGraph";
import GaugeGraph from "./GaugeGraph";
import Histogram from "./Histogram";
import ImageVisualization from "./ImageVisualization";
import LineGraph from "./LineGraph";
import MapChartLeaflet from "./MapChartLeaflet";
import MultipleChartTypes from "./MultipleChartTypes";
import PieChart from "./PieChart";
import RadarGraph from "./RadarGraph";
import ScatterPlot from "./ScatterPlot";
import SingleValue from "./SingleValue";
import SunburstChart from "./SunburstChart";
import Tables from "./Tables";
import TreeMaps from "./TreeMaps";
import DashboardTitle from "./DashboardTitle";

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

    const processData = () => {
        if (!isEmpty(data)) {
            const columns = Object.keys(data[0]);
            if (columns.length === 2) {
                const all: string[] = data.map((a: any) => {
                    const value = parseInt(a.value, 10);

                    if (value >= 100) {
                        return "a";
                    }

                    if (value >= 75) {
                        return "b";
                    }

                    return "c";
                });

                return [
                    {
                        indicator: "Achieved",
                        value: all.filter((v) => v === "a").length,
                    },
                    {
                        indicator: "Moderately Achieved",
                        value: all.filter((v) => v === "b").length,
                    },
                    {
                        indicator: "Not Achieved",
                        value: all.filter((v) => v === "c").length,
                    },
                ];
            }
        }
        return [];
    };

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
                data={processData()}
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
    };
    return allTypes[visualization.type];
};

const Visualization = ({ visualization, section }: VisualizationProps) => {
    const indicators = useStore($indicators);
    const globalFilters = useStore($globalFilters);
    const dataSources = useStore($dataSources);
    const dashboard = useStore($dashboard);
    const visualizationData = useStore($visualizationData);

    const currentIndicators = indicators.filter(
        (v) => String(visualization.indicator).split(",").indexOf(v.id) !== -1
    );
    const currentDataSources = dataSources.filter((d) => {
        return (
            currentIndicators
                .map(({ dataSource }) => dataSource)
                .indexOf(d.id) !== -1
        );
    });

    const { isLoading, isSuccess, data, isError } = useVisualization(
        visualization,
        currentIndicators,
        currentDataSources,
        dashboard.refreshInterval,
        globalFilters
    );
    // deriveSingleValues(visualizationData, visualization.expression);
    return (
        <Stack
            spacing={0}
            p={0}
            m={0}
            h="100%"
            w="100%"
            justifyContent="center"
            flex={1}
            bg={visualization.bg}
        >
            {visualization.expression &&
                getVisualization(
                    visualization,
                    deriveSingleValues(
                        visualizationData,
                        visualization.expression
                    ),
                    section
                )}
            {!visualization.expression && (
                <>
                    {isLoading && <LoadingIndicator />}
                    {isSuccess &&
                        getVisualization(visualization, data, section)}
                    {isError && <Text>No data/Error occurred</Text>}
                </>
            )}
        </Stack>
    );
};

export default Visualization;
