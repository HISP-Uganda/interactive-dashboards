import { useStore } from "effector-react";
import { update } from "lodash";
import React from "react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type LineGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const LineGraph = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
}: LineGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  let availableProperties: { [key: string]: any } = {
    ["layout.legend.y"]: -0.1,
    ["layout.legend.x"]: 0.5,
    ["layout.legend.orientation"]: "h",
    ["layout.yaxis.automargin"]: true,
    ["layout.colorway"]: [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
    ],
  };
  Object.entries(layoutProperties || {}).forEach(([property, value]) => {
    update(availableProperties, property, () => value);
  });
  return (
    <Plot
      data={processGraphs(
        data,
        category,
        series,
        dataProperties,
        metadata[visualization.id],
        "line"
      )}
      layout={{
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
        ...availableProperties.layout,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default LineGraph;
