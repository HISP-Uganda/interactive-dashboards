import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { ChartProps, IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

interface GaugeGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const GaugeGraph = ({}: GaugeGraphProps) => {
  const datas: any = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 350,
      title: { text: "Speed" },
      type: "indicator",
      mode: "gauge+number",
    },
  ];
  return (
    <Plot
      data={datas}
      layout={{ width: 500, height: 350, margin: { t: 0, b: 0 } }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default GaugeGraph;
