import { useStore } from "effector-react";
import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { divide } from "../../utils/utils";
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
  const [color, setColor] = useState<string>("");
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  const [value, setValue] = useState<any>(processSingleValue(data));
  const colorSearch = dataProperties?.["data.thresholds"]?.find(
    ({ max, min }: any) => {
      if (max && min) {
        return Number(value) >= Number(min) && Number(value) < Number(max);
      } else if (min) {
        return Number(value) >= Number(min);
      } else if (max) {
        return Number(value) <= Number(max);
      }
    }
  );

  const prefix = dataProperties?.["data.prefix"];
  const suffix = dataProperties?.["data.suffix"];
  const target = dataProperties?.["data.target"];
  const targetGraph = dataProperties?.["data.targetgraph"];
  const direction = dataProperties?.["data.direction"] || "column-reverse";
  const titleFontSize = dataProperties?.["data.title.fontSize"] || "2.0";
  const titleFontWeight = dataProperties?.["data.title.fontWeight"] || 300;
  const titleCase = dataProperties?.["data.title.case"] || "";
  const titleColor = dataProperties?.["data.title.color"] || "black";
  const singleValueBackground = dataProperties?.["data.backgroundColor"] || "";
  const singleValueBorder = dataProperties?.["data.border"] || 0;
  const fontWeight = dataProperties?.["data.format.fontWeight"] || 400;
  const fontSize = dataProperties?.["data.format.fontSize"] || 2;
  const spacing = dataProperties?.["data.format.spacing"] || 10;

  const alignment = dataProperties?.["data.alignment"] || "column";
  const format = {
    style: dataProperties?.["data.format.style"] || "decimal",
    notation: dataProperties?.["data.format.notation"] || "standard",
    maximumFractionDigits:
      dataProperties?.["data.format.maximumFractionDigits"] || 0,
  };

  useEffect(() => {
    if (colorSearch) {
      setColor(colorSearch.color);
    } else if (dataProperties?.["data.thresholds"]) {
      setColor(dataProperties?.["data.thresholds"][0].color);
    } else {
      setColor("");
    }
  }, [dataProperties]);

  useEffect(() => {
    if (visualization.expression) {
      setValue(
        processSingleValue(divide(visualization.expression, visualizationData))
      );
    }
  }, [visualizationData]);

  const numberFormatter = Intl.NumberFormat("en-US", format);

  return (
    <Stack
      alignItems="center"
      justifyItems="center"
      direction={alignment}
      backgroundColor={singleValueBackground}
      border={`${singleValueBorder}px`}
      borderRadius="3px"
      padding="4px"
      textAlign="center"
      spacing={`${spacing}px`}
    >
      {visualization.name && (
        <Text
          textTransform={titleCase}
          fontWeight={titleFontWeight}
          fontSize={`${titleFontSize}vh`}
          color={titleColor}
          whiteSpace="normal"
        >
          {visualization.name}
        </Text>
      )}
      <Stack
        direction={direction}
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        justifyItems="center"
        spacing={`${spacing}px`}
      >
        {targetGraph === "circular" && target ? (
          <CircularProgress value={(value * 100) / Number(target)}>
            <CircularProgressLabel>
              {((value * 100) / Number(target)).toFixed(0)}%
            </CircularProgressLabel>
          </CircularProgress>
        ) : targetGraph === "progress" && target ? (
          <ProgressBar completed={(value * 100) / Number(target)} bg="green" />
        ) : null}
        <Text fontSize={`${fontSize}vh`} color={color} fontWeight={fontWeight}>
          {prefix}
          {numberFormatter.format(value)}
          {suffix}
        </Text>
      </Stack>
    </Stack>
  );
};
export default SingleValue;
