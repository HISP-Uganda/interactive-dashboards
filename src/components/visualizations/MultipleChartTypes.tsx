import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type MultipleChartTypesProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
};

const MultipleChartTypes = ({
  visualization,
  category,
  series,
}: MultipleChartTypesProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

    const trace1 = {
        x: [0, 1, 2, 3, 4, 5],
        y: [1.5, 1, 1.3, 0.7, 0.8, 0.9],
        type: 'scatter'
      };
      
      const trace2 = {
        x: [0, 1, 2, 3, 4, 5],
        y: [1, 0.5, 0.7, -1.2, 0.3, 0.4],
        type: 'bar'
      };
      
      const datas:any = [trace1, trace2];
      
  return (
    // <Plot
    //   data={datas}
    //   layout={{
    //     margin: { l: 0, r: 0, b: 0, t: 0 },
    //     width: 600,
    //     height: 400,
    //   }}
    //   style={{ width: "100%", height: "100%" }}
    //   config={{ displayModeBar: false, responsive: true }}
    // />
    <Plot
      data={processGraphs(
        data,
        "scatter",
        category,
        series,
        metadata[visualization.id]
      )}
      layout={{
        // title: visualization.name,
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

export default MultipleChartTypes;
