import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type BoxplotProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const BoxPlot = ({ visualization, category, series }: BoxplotProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  const y0 = [];
  const y1 = [];
  for (var i = 0; i < 50; i++) {
    y0[i] = Math.random();
    y1[i] = Math.random() + 1;
  }

  const trace1 = {
    y: y0,
    type: "box",
  };

  const trace2 = {
    y: y1,
    type: "box",
  };

  const datas: any = [trace1, trace2];
  return (
    <Plot
      data={datas}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 600,
        height: 400,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default BoxPlot;
