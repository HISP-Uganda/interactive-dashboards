import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type BubbleMapsProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const BubbleMaps = ({ visualization, category, series }: BubbleMapsProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return (
    <></>
  );
};

export default BubbleMaps;
