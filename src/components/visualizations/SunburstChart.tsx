import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { useStore } from "effector-react";
import { $visualizationData } from "../../Store";
import { $visualizationMetadata } from "../../Store";

interface SunBurstProps extends ChartProps {
  category?: string;
  series?: string;
}

interface SunburstData {
  type: string;
  labels: string[];
  parents: string[];
  values: number[];
  outsidetextfont: {
    size: number;
    color: string;
  };
  leaf: {
    opacity: number;
  };
  marker: {
    line: {
      width: number;
    };
  };
}

const SunburstChart = ({ visualization }: SunBurstProps) => {
  const visualizationData = useStore($visualizationData)?.[visualization.id];
  const visualizationMetadata = useStore($visualizationMetadata)?.[visualization.id];

  // transform data to the format expected by the sunburst chart
  const data: SunburstData = {
    type: "sunburst",
    labels: [],
    parents: [],
    values: [],
    outsidetextfont: { size: 20, color: "#377eb8" },
    leaf: { opacity: 0.4 },
    marker: { line: { width: 2 } },
  };
  // use map to iterate over the data and metadata to populate the sunburst chart
  visualizationData?.map((dataItem) => {
    const metadataItem = visualizationMetadata?.[dataItem.dx];
    data.labels.push(metadataItem?.name);
    data.parents.push("");
    data.values.push(parseFloat(dataItem?.value));
  });

  return (
    <Plot
      data={[data]}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 50 },
        width: 500,
        height: 500,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default SunburstChart;
