import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";

interface SunBurstProps extends ChartProps {
  category?: string;
  series?: string;
}

const SunburstChart = ({}: SunBurstProps) => {
  const datas: any = [
    {
      type: "sunburst",
      labels: [
        "Eve",
        "Cain",
        "Seth",
        "Enos",
        "Noam",
        "Abel",
        "Awan",
        "Enoch",
        "Azura",
      ],
      parents: ["", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve"],
      values: [10, 14, 12, 10, 2, 6, 6, 4, 4],
      outsidetextfont: { size: 20, color: "#377eb8" },
      leaf: { opacity: 0.4 },
      marker: { line: { width: 2 } },
    },
  ];

  return (
    <Plot
      data={datas}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 500,
        height: 500,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default SunburstChart;
