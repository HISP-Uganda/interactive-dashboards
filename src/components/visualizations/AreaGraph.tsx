import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type AreaGraphProps = {
    visualization: IVisualization;
    category?: string;
    series?: string;
  };

  const trace1 = {
    x: [1, 2, 3, 4],
    y: [0, 2, 3, 5],
    fill: 'tozeroy',
    type: 'scatter'
  };
  
  const trace2 = {
    x: [1, 2, 3, 4],
    y: [3, 5, 1, 7],
    fill: 'tonexty',
    type: 'scatter'
  };
  
  const datas:any = [trace1, trace2];

const AreaGraph = ({ visualization, category, series }: AreaGraphProps) => {
    const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
    
    return (
      <Plot
      data={datas}
      layout={{ width: 500, height: 350, margin: { t: 0, b: 0 } }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
    )
}

export default AreaGraph
