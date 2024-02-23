import { Text } from "@chakra-ui/react";
import { useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import {
  ISection,
  IVisualization,
  IVisualization2,
  LocationGenerics,
} from "../../interfaces";
import { useVisualization, useVisualizationMetadata } from "../../Queries";
import {
  $calculated,
  $dashboard,
  $globalFilters,
  $settings,
} from "../../Store";
import { deriveSingleValues } from "../../utils/utils";
import DashboardTree from "../DashboardTree";
import LoadingIndicator from "../LoadingIndicator";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import BoxPlot from "./BoxPlot";
import BubbleMaps from "./BubbleMaps";
import CategoryList from "./CategoryList";
import ClockVisualisation from "./ClockVisualisation";
import DashboardList from "./DashboardList";
import DashboardTitle from "./DashboardTitle";
import DHIS2Visualization from "./DHIS2Visualization";
import Filters from "./Filters";
import FunnelGraph from "./FunnelGraph";
import GaugeGraph from "./GaugeGraph";
import HeatMap from "./HeatMap";
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
import TextVisualisation from "./TextVisualisation";
import TreeMaps from "./TreeMaps";
import DividerVisualization from "./DividerVisualization";
import MicroPlanning from "./MicroPlanning";

type VisualizationProps = {
  visualization: IVisualization;
  metadata: IVisualization2;
  section: ISection;
};

export const getVisualization = (
  visualization: IVisualization,
  data: any,
  section: ISection,
  metadata?: IVisualization2
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
        vizDetails={metadata}
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
    dashboardList: <DashboardList visualization={visualization} />,
    dashboardTree: <DashboardTree visualization={visualization} />,
    categoryList: (
      <CategoryList section={section} visualization={visualization} />
    ),
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
    microPlanningDashboard: (
      <MicroPlanning
        section={section}
        data={data}
        visualization={visualization}
        {...otherProperties}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    ),
    filters: <Filters />,
    dashboardTitle: (
      <DashboardTitle section={section} visualization={visualization} />
    ),
    optionSet: <OptionSet visualization={visualization} section={section} />,
    text: <TextVisualisation visualization={visualization} section={section} />,
    clock: (
      <ClockVisualisation visualization={visualization} section={section} />
    ),
    heatmap: <HeatMap visualization={visualization} section={section} />,
    dhis2: (
      <DHIS2Visualization visualization={visualization} section={section} />
    ),
    divider: <DividerVisualization />,
  };
  if (visualization.properties["display"] === "multiple") {
    return (
      <Tables
        section={section}
        data={data}
        visualization={visualization}
        layoutProperties={layoutProperties}
        dataProperties={dataProperties}
      />
    );
  }
  return allTypes[visualization.type];
};

const VisualizationMetaData = ({
  visualization,
  section,
}: {
  visualization: IVisualization;
  section: ISection;
}) => {
  const { storage } = useStore($settings);
  const { isLoading, isSuccess, data, isError, error } =
    useVisualizationMetadata(visualization, storage);

  if (isError) return <Text>{error?.message}</Text>;

  if (isLoading) return <LoadingIndicator />;
  if (isSuccess && data)
    return (
      <Visualization
        visualization={visualization}
        metadata={data}
        section={section}
      />
    );
  return null;
};

const Visualization = ({
  visualization,
  section,
  metadata,
}: VisualizationProps) => {
  const search = useSearch<LocationGenerics>();
  const globalFilters = useStore($globalFilters);
  const dashboard = useStore($dashboard);
  const calculated = useStore($calculated);
  const { affected, optionSet } = search;
  const { isLoading, isSuccess, data, isError, error } = useVisualization(
    metadata,
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
            getVisualization(visualization, data, section, metadata)}
          {isError && <Text>{error?.message}</Text>}
        </>
      )}
    </>
  );
};

export default VisualizationMetaData;
