import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { update } from "lodash";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processGraphs } from "../processors";

type BarGraphProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
  category?: string;
  series?: string;
};

const BarGraph = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
}: BarGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  let availableProperties: { [key: string]: any } = {
    layout: {
      legend: { x: 0.5, y: -0.3, orientation: "h" },
      yaxis: { automargin: true },
      colorway: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
      ],
    },
  };
  Object.entries(layoutProperties || {}).forEach(([property, value]) => {
    update(availableProperties, property, () => value);
  });
  return (
    <Stack w="100%" h="100%">
      <Text textAlign="center">{visualization.name}</Text>
      <Stack h="100%" w="100%" flex={1}>
        <Plot
          data={processGraphs(
            data,
            category,
            series,
            dataProperties,
            metadata[visualization.id]
          )}
          layout={{
            margin: {
              // pad: 5,
              r: 10,
              t: 0,
              l: 70,
              b: 0,
            },
            autosize: true,
            showlegend: true,
            xaxis: {
              automargin: true,
            },
            ...availableProperties.layout,
          }}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </Stack>
    </Stack>
  );
};

export default BarGraph;
