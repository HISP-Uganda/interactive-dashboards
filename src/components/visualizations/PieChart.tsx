import { useStore } from "effector-react";
import React from "react";
import Plot from "react-plotly.js";

import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { processPieChart } from "../processors";

type PieChartProps = {
  visualization: IVisualization;
  labels?: string;
  values?: string;
};

const PieChart = ({ visualization, labels, values }: PieChartProps) => {
  const visualizationData = useStore($visualizationData);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return (
    <Plot
      data={processPieChart(data, labels, values)}
      layout={{
        title: visualization.name,
        margin: {
          pad: 0,
          r: 0,
          t: 0,
          l: 0,
          b: 0,
        },
        autosize: true,
        showlegend: false,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default PieChart;
