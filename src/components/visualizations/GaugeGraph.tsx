import { Stack } from "@chakra-ui/react";
import React from "react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import VisualizationTitle from "./VisualizationTitle";

interface GaugeGraphProps extends ChartProps {
  category?: string;
  series?: string;
}

const GaugeGraph = ({ visualization, section, data }: GaugeGraphProps) => {
  const color = visualization.properties?.color?.[0] || "blue";
  const titleText = visualization.showTitle ? "Gauge Graph" : "";
  const titleFontSize =
    visualization.properties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = visualization.properties?.["data.title.case"] || "";
  const titleColor =
    visualization.properties?.["data.title.color"] || "gray.500";
  return (
    <Stack w="100%" h="100%" spacing={0}>
      {visualization.name && (
        <VisualizationTitle
          section={section}
          fontSize={titleFontSize}
          textTransform={titleCase}
          color={titleColor}
          title={visualization.name}
          fontWeight="bold"
        />
      )}
      <Plot
        data={[
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: data.length > 0 ? data[0].value : 0,
            title: { text: titleText },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { range: [null, 100] },
              bar: { color: color },
            },
          },
        ]}
        layout={{ margin: { t: 0, b: 0 } }}
        style={{ width: "100%", height: "100%" }}
        config={{ displayModeBar: false, responsive: true }}
      />
    </Stack>
  );
};

export default GaugeGraph;
