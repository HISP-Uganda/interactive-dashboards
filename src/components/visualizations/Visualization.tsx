import { Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import {
  $dashboard,
  $dataSources,
  $globalFilters,
  $indicators,
  $store,
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

type VisualizationProps = {
  visualization: IVisualization;
};

const getVisualization = (visualization: IVisualization) => {
  const allTypes: any = {
    single: (
      <SingleValue
        visualization={visualization}
        {...visualization.properties}
      />
    ),
    bar: (
      <BarGraph visualization={visualization} {...visualization.properties} />
    ),
    pie: (
      <PieChart visualization={visualization} {...visualization.properties} />
    ),
    map: (
      <MapChart visualization={visualization} {...visualization.properties} />
    ),
    line: (
      <LineGraph visualization={visualization} {...visualization.properties} />
    ),
    sunburst: (
      <SunburstChart visualization={visualization} {...visualization.properties} />
    ),
    gauge: (
      <GaugeGraph visualization={visualization} {...visualization.properties} />
    ),
    histogram: (
      <Histogram visualization={visualization} {...visualization.properties} />
    ),
    area: (
      <AreaGraph visualization={visualization} {...visualization.properties} />
    ),
    radar: (
      <RadarGraph visualization={visualization} {...visualization.properties} />
    ),
    bubblemaps: (
      <BubbleMaps visualization={visualization} {...visualization.properties} />
    ),
    funnelplot: (
      <FunnelGraph visualization={visualization} {...visualization.properties} />
    ),
    multiplecharts: (
      <MultipleChartTypes visualization={visualization} {...visualization.properties} />
    ),
    treemaps: (
      <TreeMaps visualization={visualization} {...visualization.properties} />
    ),
    tables: (
      <Tables visualization={visualization} {...visualization.properties} />
    ),
    boxplot: (
      <BoxPlot visualization={visualization} {...visualization.properties} />
    ),
    scatterplot: (
      <ScatterPlot visualization={visualization} {...visualization.properties} />
    ),
  };
  return allTypes[visualization.type];
};

const Visualization = ({ visualization }: VisualizationProps) => {
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
      {isSuccess && getVisualization(visualization)}
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </>
  );
};

export default Visualization;
