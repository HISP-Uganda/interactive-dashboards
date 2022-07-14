import { useStore } from "effector-react";
import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { Stack, Text, Icon } from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { processSingleValue } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const SingleValue = ({
  visualization,
  dataProperties,
  layoutProperties,
}: SingleValueProps) => {
  const visualizationData = useStore($visualizationData);
  const [color, setColor] = useState<string>("");
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  const value = processSingleValue(data);

  const colorSearch = dataProperties?.["data.thresholds"]?.find(
    ({ max, min }: any) => {
      if (max && min) {
        return Number(value) >= Number(min) && Number(value) <= Number(max);
      } else if (min) {
        return Number(value) >= Number(min);
      } else if (max) {
        return Number(value) <= Number(max);
      }
    }
  );

  useEffect(() => {
    if (colorSearch) {
      setColor(colorSearch.color);
    } else if (dataProperties?.["data.thresholds"]) {
      setColor(dataProperties?.["data.thresholds"][0].color);
    } else {
      setColor("");
    }
  }, [dataProperties]);

  return (
    <Stack w="100%" h="100%" alignItems="center">
      {visualization.name && <Text>{visualization.name}</Text>}
      <Stack w="100%" h="100%" flex={1}>
        <Plot
          data={[
            {
              type: "indicator",
              mode: "number",
              number: {
                font: {
                  color,
                },
              },
              value: processSingleValue(data),
            },
          ]}
          layout={{
            margin: { t: 0, r: 0, l: 0, b: 0, pad: 0 },
            autosize: true,
          }}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false, responsive: true }}
        />
        <Icon viewBox="0 0 200 200" color="red.500">
          <text>why</text>
        </Icon>
      </Stack>
    </Stack>
  );
};
export default SingleValue;
