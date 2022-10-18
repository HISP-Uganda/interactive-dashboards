import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";

interface TreeMapsProps extends ChartProps {
  category?: string;
  series?: string;
}

const TreeMaps = ({}: TreeMapsProps) => {
  const datas: any = [
    {
      type: "treemap",
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
    },
  ];

  return (
    <Plot
      data={datas}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 600,
        height: 300,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default TreeMaps;
