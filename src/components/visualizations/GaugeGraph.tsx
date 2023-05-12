import React from "react";
import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { $visualizationData } from "../../Store";

interface GaugeGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const GaugeGraph = ({ visualization,category, series }: GaugeGraphProps) => {
  const visualizationData = useStore($visualizationData)?.[visualization.id];

  const value = visualizationData?.find(
    (data) => data.category === category && data.series === series
  )?.value || 0;

  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: value,
      title: { text: "data" },
      type: "indicator",
      mode: "gauge+number",
    },
  ];

  return (
    <Plot
      data={data}
      layout={{ width: 500, height: 350, margin: { t: 0, b: 0 } }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default GaugeGraph;
