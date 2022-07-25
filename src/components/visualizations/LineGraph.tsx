import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { update } from "lodash";
import React from "react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { exclusions } from "../../utils/utils";
import { processGraphs } from "../processors";

type LineGraphProps = {
  visualization: IVisualization;
  category?: string;
  series?: string;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const LineGraph = ({
  visualization,
  category,
  series,
  layoutProperties,
  dataProperties,
}: LineGraphProps) => {
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
  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = dataProperties?.["data.title.case"] || "uppercase";
  const titleColor = dataProperties?.["data.title.color"] || "black";
  return (
    <Stack w="100%" h="100%">
      {visualization.name && (
        <Text
          textAlign="center"
          fontSize={titleFontSize}
          textTransform={titleCase}
          color={titleColor}
        >
          {visualization.name}
        </Text>
      )}
      <Stack h="100%" w="100%" flex={1}>
        <Plot
          data={processGraphs(
            data,
            category,
            series,
            dataProperties,
            metadata[visualization.id],
            "line"
          )}
          layout={{
            margin: {
              pad: 5,
              r: 10,
              t: 0,
              l: 60,
              b: 0,
            },
            autosize: true,
            showlegend: true,
            xaxis: {
              automargin: true,
              showgrid: false,
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

export default LineGraph;
