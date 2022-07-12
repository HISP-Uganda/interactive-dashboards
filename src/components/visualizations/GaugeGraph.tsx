import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type GaugeGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const GaugeGraph = ({ visualization, category, series }: GaugeGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

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
