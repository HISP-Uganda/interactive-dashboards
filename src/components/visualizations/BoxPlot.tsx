import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type BoxplotProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const BoxPlot = ({ visualization, category, series }: BoxplotProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return <div></div>;
};

export default BoxPlot;
