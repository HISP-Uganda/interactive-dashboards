import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type RadarGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const RadarGraph = ({ visualization, category, series }: RadarGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  const datas: any = [
    {
      type: "scatterpolar",
      r: [39, 28, 8, 7, 28, 39],
      theta: ["A", "B", "C", "D", "E", "A"],
      fill: "toself",
      name: "Group A",
    },
    {
      type: "scatterpolar",
      r: [1.5, 10, 39, 31, 15, 1.5],
      theta: ["A", "B", "C", "D", "E", "A"],
      fill: "toself",
      name: "Group B",
    },
  ];

  return (
    <Plot
      data={datas}
      layout={{
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 50],
          },
        },
      }}
    />
  );
};

export default RadarGraph;
