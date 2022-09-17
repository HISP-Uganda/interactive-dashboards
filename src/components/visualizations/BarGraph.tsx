import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { update } from "lodash";
import { useElementSize } from "usehooks-ts";
import Plot from "react-plotly.js";
import { ISection, IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { exclusions } from "../../utils/utils";
import { processGraphs } from "../processors";
import VisualizationTitle from "./VisualizationTitle";

type BarGraphProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
  category?: string;
  series?: string;
  section: ISection;
};

const BarGraph = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
  section,
}: BarGraphProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
  const [squareRef, { width, height }] = useElementSize();

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

  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = dataProperties?.["data.title.case"] || "uppercase";
  const titleColor = dataProperties?.["data.title.color"] || "black";
  return (
    <Stack ref={squareRef} h="100%" spacing={0}>
      {visualization.name && (
        <VisualizationTitle
          title={visualization.name}
          section={section}
        />
      )}

      <Stack flex={1}>
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
              pad: 5,
              r: 10,
              t: 0,
              l: 50,
              b: 0,
            },
            autosize: true,
            showlegend: true,
            xaxis: {
              automargin: true,
              showgrid: false,
            },
            ...availableProperties.layout,
          }}
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: true,
            responsive: true,
            toImageButtonOptions: {
              format: "svg",
              scale: 1,
            },
            modeBarButtonsToRemove: exclusions,
            displaylogo: false,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default BarGraph;
