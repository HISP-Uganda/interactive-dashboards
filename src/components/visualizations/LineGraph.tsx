import { useStore } from "effector-react";
import React from "react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { processGraphs } from "../processors";

type LineGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const LineGraph = ({ visualization, category, series }: LineGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return (
    <Plot
      data={processGraphs(data, "line", category, series)}
      layout={{
        title: visualization.name,
        margin: {
          pad: 5,
          r: 5,
          t: 0,
          l: 30,
          b: 20,
        },
        autosize: true,
        showlegend: true,
        xaxis: {
          automargin: true,
        },
        legend: {
          orientation: "h",
          traceorder: "normal",
          yanchor: "top",
          y: -0.1,
          xanchor: "left",
          x: 0.5,
          font: {},
        },
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default LineGraph;
