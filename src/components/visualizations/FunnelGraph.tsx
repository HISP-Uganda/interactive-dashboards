import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";

interface FunnelGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const FunnelGraph = ({}: FunnelGraphProps) => {
  const datas: any = [
    {
      type: "funnel",
      y: [
        "Number tested TB Positive",
        "EPTB Confirmed",
        "P-BC Confirmed",
        "P-CD Confirmed",
        "TB Cases Notified",
      ],
      x: [13873, 10533, 5443, 2703, 908],
      hoverinfo: "x+percent previous+percent initial",
    },
  ];
  return (
    <Plot
      data={datas}
      layout={{ margin: { l: 160 }, width: 500, height: 350 }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default FunnelGraph;
