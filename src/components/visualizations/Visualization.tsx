import { Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
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
import BoxPlot from "./BoxPlot";
import BubbleMaps from "./BubbleMaps";
import FunnelGraph from "./FunnelGraph";
import GaugeGraph from "./GaugeGraph";
import Histogram from "./Histogram";
import LineGraph from "./LineGraph";
import MapChart from "./MapChart";
import MapChartLeaflet from "./MapChartLeaflet";
import MapChartNivo from "./MapChartNivo";
import MultipleChartTypes from "./MultipleChartTypes";
import PieChart from "./PieChart";
import RadarGraph from "./RadarGraph";
import ScatterPlot from "./ScatterPlot";
import SingleValue from "./SingleValue";
import SunburstChart from "./SunburstChart";
import Tables from "./Tables";
import TreeMaps from "./TreeMaps";

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
  };
  return allTypes[visualization.type];
};

const Visualization = ({ visualization, section }: VisualizationProps) => {
  const indicators = useStore($indicators);
  const globalFilters = useStore($globalFilters);
  const dataSources = useStore($dataSources);
  const dashboard = useStore($dashboard);

  const currentIndicators = indicators.filter(
    (v) => String(visualization.indicator).split(",").indexOf(v.id) !== -1
  );
  const currentDataSources = dataSources.filter((d) => {
    return (
      currentIndicators.map(({ dataSource }) => dataSource).indexOf(d.id) !== -1
    );
  });

  const { isLoading, isSuccess, data, isError, error } = useVisualization(
    visualization,
    currentIndicators,
    currentDataSources,
    dashboard.refreshInterval,
    globalFilters
  );

  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && getVisualization(visualization, data, section)}
      {isError && <pre>{error.message}</pre>}
    </>
  );
};

export default Visualization;
