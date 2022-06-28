import { useStore } from "effector-react";
import { IVisualization } from "../../interfaces";
import { $indicatorDataSourceTypes } from "../../Store";
import BarGraphProperties from "../properties/BarGraphProperties";
import LineGraphProperties from "../properties/LineGraphProperties";
import MapChartProperties from "../properties/MapChartProperties";
import PieChartProperties from "../properties/PieChartProperties";
import SingleValueProperties from "../properties/SingleValueProperties";

type VizProps = {
  visualization: IVisualization;
};

const VisualizationProperties = ({ visualization }: VizProps) => {
  const indicatorDataSourceTypes = useStore($indicatorDataSourceTypes);
  const dataSourceType = indicatorDataSourceTypes[visualization.indicator];
  const displayProperties = (visualizationType: string | undefined) => {
    const allTypes: any = {
      single: <SingleValueProperties visualization={visualization} />,
      bar: <BarGraphProperties visualization={visualization} />,
      line: <LineGraphProperties visualization={visualization} />,
      pie: <PieChartProperties visualization={visualization} />,
      map: <MapChartProperties visualization={visualization} />,
    };
    if (visualizationType) {
      return allTypes[visualizationType] || null;
    }
    return <div>Nothing to display</div>;
  };
  return <>{displayProperties(visualization.type)}</>;
};

export default VisualizationProperties;
