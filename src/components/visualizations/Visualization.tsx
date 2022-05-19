import { Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import { $dashboard, $dataSources, $indicators, $store } from "../../Store";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import MapChart from "./MapChart";
import PieChart from "./PieChart";
import SingleValue from "./SingleValue";

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
  };
  return allTypes[visualization.type];
};

const Visualization = ({ visualization }: VisualizationProps) => {
  const indicators = useStore($indicators);
  const store = useStore($store);
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
    store.selectedOrganisation,
    store.periodType,
    store.relativePeriod,
    store.fixedPeriod,
    dashboard.refreshInterval
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
