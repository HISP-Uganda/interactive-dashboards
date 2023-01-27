import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";

interface BoxplotProps extends ChartProps {
  category?: string;
  series?: string;
}

const BoxPlot = ({}: BoxplotProps) => {
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
