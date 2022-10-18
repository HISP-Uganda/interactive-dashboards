import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";

interface RadarGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const RadarGraph = ({}: RadarGraphProps) => {
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
