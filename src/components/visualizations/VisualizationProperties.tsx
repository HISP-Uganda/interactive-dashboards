import { IVisualization } from "../../interfaces";
import SingleValueProperties from "../properties/SingleValueProperties";

type VizProps = {
  visualization: IVisualization;
};

const VisualizationProperties = ({ visualization }: VizProps) => {
  const displayProperties = (visualizationType: string | undefined) => {
    const allTypes: any = {
      single: <SingleValueProperties visualization={visualization} />,
    };
    if (visualizationType) {
      return allTypes[visualizationType] || null;
    }
    return <div>Nothing to display</div>;
  };
  return <>{displayProperties(visualization.type)}</>;
};

export default VisualizationProperties;
