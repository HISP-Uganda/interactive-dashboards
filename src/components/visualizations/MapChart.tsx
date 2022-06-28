import { useStore } from "effector-react";
import React from "react";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";

type MapChartProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const MapChart = ({ visualization, category, series }: MapChartProps) => {
  const visualizationData = useStore($visualizationData);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return <div>MapChart</div>;
};

export default MapChart;
