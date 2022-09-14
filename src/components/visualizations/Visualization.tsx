import { Spinner, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ISection, IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import {
  $dashboard,
  $dataSources,
  $globalFilters,
  $indicators,
} from "../../Store";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import BubbleMaps from "./BubbleMaps";
import FunnelGraph from "./FunnelGraph";
import GaugeGraph from "./GaugeGraph";
import Histogram from "./Histogram";
import LineGraph from "./LineGraph";
import MapChart from "./MapChart";
import PieChart from "./PieChart";
import RadarGraph from "./RadarGraph";
import SingleValue from "./SingleValue";
import SunburstChart from "./SunburstChart";
import MultipleChartTypes from "./MultipleChartTypes";
import TreeMaps from "./TreeMaps";
import Tables from "./Tables";
import BoxPlot from "./BoxPlot";
import ScatterPlot from "./ScatterPlot";
import { fromPairs } from "lodash";
import Marquee from "./Marquee";

type VisualizationProps = {
  visualization: IVisualization;
  section: ISection;
};

const getVisualization = (visualization: IVisualization, section: ISection) => {
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
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    bar: (
      <BarGraph
        section={section}
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    pie: (
      <PieChart
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    map: (
      <MapChart
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    line: (
      <LineGraph
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    sunburst: (
      <SunburstChart
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    gauge: (
      <GaugeGraph
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    histogram: (
      <Histogram
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    area: (
      <AreaGraph
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    radar: (
      <RadarGraph
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    bubblemaps: (
      <BubbleMaps
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    funnelplot: (
      <FunnelGraph
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    multiplecharts: (
      <MultipleChartTypes
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    treemaps: (
      <TreeMaps
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    tables: (
      <Tables
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    boxplot: (
      <BoxPlot
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    scatterplot: (
      <ScatterPlot
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    marquee: (
      <Marquee
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
  };
  return allTypes[visualization.type];
};

const Visualization = ({ visualization, section }: VisualizationProps) => {
  const indicators = useStore($indicators);
  const globalFilters = useStore($globalFilters);
  const dataSources = useStore($dataSources);
  const dashboard = useStore($dashboard);

  const indicator = indicators.find((v) => v.id === visualization.indicator);
  const dataSource = dataSources.find((d) => {
    return d.id === indicator?.dataSource;
  });

  const { isLoading, isSuccess, isError, error } = useVisualization(
    visualization,
    indicator,
    dataSource,
    dashboard.refreshInterval,
    globalFilters
  );

  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && getVisualization(visualization, section)}
      {isError && <pre>{error.message}</pre>}
    </>
  );
};

export default Visualization;
