import { useStore } from "effector-react";
import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { processSingleValue } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const numberFormatter = Intl.NumberFormat("en-US", {
  style: "decimal",
  // notation: "compact",
  maximumFractionDigits: 0,
});

const ProgressBar = ({ bg, completed }: { bg: string; completed: number }) => {
  return (
    <Box
      height="20px"
      width="100%"
      minWidth="200px"
      backgroundColor="#e0e0de"
      borderRadius="50px"
    >
      <Box
        height="100%"
        width={`${completed > 100 ? "100" : completed}%`}
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
  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.7vh";
  const titleCase = dataProperties?.["data.title.case"] || "uppercase";
  const titleColor = dataProperties?.["data.title.color"] || "black";
  const alignment = dataProperties?.["data.alignment"] || "column";
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
      alignItems="center"
      alignContent="center"
      justifyContent="center"
      justifyItems="center"
      direction={alignment}
      textAlign="center"
      // flex={1}
      // w="100%"
      // h="100%"
      spacing={
        alignment === "row" || alignment === "row-reverse" ? "10px" : "5px"
      }
    >
      {visualization.name && (
        <Tooltip label={visualization.name} hasArrow placement="top">
          <Text
            textTransform="uppercase"
            fontWeight="medium"
            fontSize={titleFontSize}
            color={titleColor}
            whiteSpace={
              alignment === "row" || alignment === "row-reverse"
                ? "nowrap"
                : "normal"
            }
            // noOfLines={
            //   alignment === "row" || alignment === "row-reverse" ? undefined : 1
            // }
          >
            {visualization.name}
          </Text>
        </Tooltip>
      )}
      <Stack
        w="100%"
        direction={direction}
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        justifyItems="center"
        flex={1}
        h="100%"
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
        <Text fontSize={"3.3vh"} color={color} fontWeight="bold">
          {prefix}
          {numberFormatter.format(processSingleValue(data))}
          {suffix}
        </Text>
      </Stack>
    </Stack>
  );
};
export default SingleValue;
