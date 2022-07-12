import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { Stack, Text } from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { processSingleValue } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  valueformat?: string;
  prefix?: string;
  suffix?: string;
  valueSize?: number | undefined;
  titleSize?: number | undefined;
  valueColor?: string;
  titleColor?: string;
};

const SingleValue = ({
  visualization,
  valueformat,
  prefix,
  suffix,
  valueSize,
  titleSize,
  valueColor,
  titleColor,
}: SingleValueProps) => {
  const visualizationData = useStore($visualizationData);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return (
    <Stack w="100%" h="100%" alignItems="center">
      <Text>{visualization.name}</Text>
      <Stack w="100%" h="100%" flex={1}>
        <Plot
          data={[
            {
              type: "indicator",
              mode: "number",
              number: {
                valueformat: "",
                prefix,
                suffix,
                font: {
                  size: valueSize,
                  color: valueColor,
                },
              },
              value: processSingleValue(data),
            },
          ]}
          layout={{
            title: visualization.name,
            margin: { t: 0, r: 0, l: 0, b: 0, pad: 0 },
            autosize: true,
          }}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </Stack>
    </Stack>
  );
};
export default SingleValue;
