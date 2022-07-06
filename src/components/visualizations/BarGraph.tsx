import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import deepUpdateObject from "deep-update-object";

import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";
import { updateValAtKey } from "../../utils/utils";
import { set, update } from "lodash";

type BarGraphProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
  category?: string;
  series?: string;
};

const BarGraph = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
}: BarGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  let availableProperties: { [key: string]: any } = {};
  update(availableProperties, "layout.legend.y", () => -0.1);
  update(availableProperties, "layout.legend.x", () => 0.5);
  update(availableProperties, "layout.legend.orientation", () => "h");
  update(availableProperties, "layout.yaxis.automargin", () => true);
  update(availableProperties, "layout.colorway", () => [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
  ]);
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
        metadata[visualization.id]
      )}
      layout={{
        title: visualization.name,
        margin: {
          // pad: 5,
          r: 5,
          // t: 0,
          l: 50,
          b: 20,
        },
        gridcolor: "lightgray",
        zerolinecolor: "lightgray",
        autosize: true,
        showlegend: true,
        xaxis: {
          automargin: true,
          gridwidth: 2,
        },
        ...availableProperties.layout,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default BarGraph;
