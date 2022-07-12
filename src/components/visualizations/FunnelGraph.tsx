import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type FunnelGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const FunnelGraph = ({ visualization, category, series }: FunnelGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

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
