import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type BarGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const BarGraph = ({ visualization, category, series }: BarGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  return (
    <Plot
      data={processGraphs(
        data,
        "bar",
        category,
        series,
        metadata[visualization.id]
      )}
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

export default BarGraph;
