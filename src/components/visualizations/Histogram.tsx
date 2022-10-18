import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";

interface HistogramProps extends ChartProps {
  category?: string;
  series?: string;
}

const Histogram = ({}: HistogramProps) => {
  const x = [];
  for (let i = 0; i < 500; i++) {
    x[i] = Math.random();
  }

  const trace = {
    x: x,
    type: "histogram",
  };
  const datas: any = [trace];

  return (
    <Plot
      data={datas}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 600,
        height: 350,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default Histogram;
