
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { useStore } from "effector-react";
import { $visualizationData, $visualizationMetadata } from "../../Store";

interface RadarGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const RadarGraph = ({ visualization }: RadarGraphProps) => {
  const visualizationData = useStore($visualizationData)?.[visualization.id];
  const visualizationMetadata = useStore($visualizationMetadata)?.[visualization.id];
  console.log("your data is:", visualizationData);
  console.log("your meta data is:", visualizationMetadata);
  const datas = Object.entries(visualizationData || {}).map(([key, data]) => {
    const metadata = visualizationMetadata?.[data.pe];

    return {
      type: "scatterpolar",
      r: [data.value],
      theta: [metadata?.name || ""],
      fill: "toself",
      name: visualizationMetadata[data.dx]?.name || "",
      // Add color and marker size properties
      marker: {
       // color: visualization.properties.color, // Set the desired color
        size: visualization.properties.markerSize, // Set the desired marker size
      },
    };
  });

  return (
    <Plot
      data={datas}
      layout={{
        polar: {
          radialaxis: {
            visible: true,
            range: [0, Math.max(...Object.values(visualizationData || {}).map((data) => +data.value)) * 1.1],
          },
        },
        // Add title property
        title: visualization.showTitle ? 'Radar Graph' : '', // Set the desired title
      }}
    />
  );
};

export default RadarGraph;
