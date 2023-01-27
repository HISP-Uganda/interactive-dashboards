import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

interface MultipleChartTypesProps extends ChartProps {
  category?: string;
  series?: string;
}

const MultipleChartTypes = ({
  visualization,
  category,
  series,
  data,
}: MultipleChartTypesProps) => {
  const metadata = useStore($visualizationMetadata);
  return (
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
