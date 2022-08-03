import { useStore } from "effector-react";
import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processSingleValue } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const ProgressBar = ({ bg, completed }: { bg: string; completed: number }) => {
  return (
    <Box
      height="20px"
      width="100%"
      backgroundColor="#e0e0de"
      borderRadius="50px"
    >
      <Box
        height="100%"
        width={`${completed}%`}
        bg={bg}
        borderRadius="inherit"
        textAlign="right"
      >
        <Box
          as="span"
          padding="5px"
          color="white"
          fontWeight="bold"
        >{`${completed.toFixed(1)}%`}</Box>
      </Box>
    </Box>
  );
};

const SingleValue = ({
  visualization,
  dataProperties,
  layoutProperties,
}: SingleValueProps) => {
  const visualizationData = useStore($visualizationData);
  const metadata = useStore($visualizationMetadata);
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

  const prefix = dataProperties?.["data.prefix"];
  const suffix = dataProperties?.["data.suffix"];
  const valueformat = dataProperties?.["data.valueformat"];
  const target = dataProperties?.["data.target"];
  const targetGraph = dataProperties?.["data.targetgraph"];
  const direction = dataProperties?.["data.direction"] || "column-reverse";
  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = dataProperties?.["data.title.case"] || "uppercase";
  const titleColor = dataProperties?.["data.title.color"] || "black";
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
    <Stack
      w="100%"
      h="100%"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
      justifyItems="center"
    >
      {visualization.name && (
        <Text
          fontSize={titleFontSize}
          textTransform={titleCase}
          color={titleColor}
        >
          {visualization.name}
        </Text>
      )}
      <Stack
        w="100%"
        h="100%"
        flex={1}
        direction={direction}
        alignItems="center"
      >
        {targetGraph === "circular" && target ? (
          <CircularProgress
            value={(processSingleValue(data) * 100) / Number(target)}
          >
            <CircularProgressLabel>
              {((processSingleValue(data) * 100) / Number(target)).toFixed(0)}%
            </CircularProgressLabel>
          </CircularProgress>
        ) : targetGraph === "progress" && target ? (
          <ProgressBar
            completed={(processSingleValue(data) * 100) / Number(target)}
            bg="green"
          />
        ) : null}
        <Stack w="100%" h="100%">
          <Plot
            data={[
              {
                type: "indicator",
                mode: "number",
                number: {
                  font: {
                    color,
                  },
                  prefix,
                  suffix,
                  valueformat,
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
        </Stack>
      </Stack>
    </Stack>
  );
};
export default SingleValue;
