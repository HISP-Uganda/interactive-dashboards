import { useEffect, useState } from "react";

import {
    Box,
    CircularProgress,
    CircularProgressLabel,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Progress } from "antd";
import { ChartProps } from "../../interfaces";
import { processSingleValue } from "../processors";
import { useStore } from "effector-react";
import { $visualizationData } from "../../Store";

const ProgressBar = ({
    bgColor,
    completed,
}: {
    bgColor: string;
    completed: number;
}) => {
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
                bgColor={bgColor}
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
    data,
}: ChartProps) => {
    const [color, setColor] = useState<string>("");
    const [targetValue, setTargetValue] = useState<number | undefined | null>();
    const visualizationData = useStore($visualizationData);
    const value = processSingleValue(data);
    const colorSearch = dataProperties?.["data.thresholds"]?.find(
        ({ max, min }: any) => {
            if (max && min) {
                return (
                    Number(value) >= Number(min) && Number(value) < Number(max)
                );
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
    const direction = dataProperties?.["data.direction"] || "column";
    const titleFontSize = dataProperties?.["data.title.fontSize"] || "2.0";
    const titleFontWeight = dataProperties?.["data.title.fontWeight"] || 300;
    const titleCase = dataProperties?.["data.title.case"] || "";
    const titleColor = dataProperties?.["data.title.color"] || "black";
    const singleValueBackground = "none";
    // const singleValueBackground = dataProperties?.["data.backgroundColor"] || "";
    const singleValueBorder = dataProperties?.["data.border"] || 0;
    const fontWeight = dataProperties?.["data.format.fontWeight"] || 400;
    const fontSize = dataProperties?.["data.format.fontSize"] || 2;
    const alignment = dataProperties?.["data.alignment"] || "column";
    const bg = layoutProperties?.["layout.bg"] || "";
    const radius = dataProperties?.["data.targetradius"] || 60;
    const thickness = dataProperties?.["data.targetthickness"] || 10;
    const targetColor = dataProperties?.["data.targetcolor"] || "blue";
    const targetSpacing = dataProperties?.["data.targetspacing"] || 0;
    const spacing =
        dataProperties?.["data.format.spacing"] ||
        ["row", "row-reverse"].indexOf(alignment) !== -1
            ? 10
            : 0;

    const format = {
        style: dataProperties?.["data.format.style"] || "decimal",
        notation: dataProperties?.["data.format.notation"] || "standard",
        maximumFractionDigits:
            dataProperties?.["data.format.maximumFractionDigits"] || 0,
    };

    useEffect(() => {
        if (colorSearch) {
            setColor(() => colorSearch.color);
        } else if (dataProperties?.["data.thresholds"]) {
            setColor(() => dataProperties?.["data.thresholds"][0].color);
        } else {
            setColor(() => "");
        }
    }, [dataProperties]);

    useEffect(() => {
        if (target) {
            const data = visualizationData[target];
            if (data) {
                setTargetValue(() => Number(data[0].value));
            } else {
                setTargetValue(() => Number(target));
            }
        }
    }, [target, visualizationData]);

    const numberFormatter = Intl.NumberFormat("en-US", format);

    return (
        <Stack
            alignItems="center"
            justifyItems="center"
            alignContent="center"
            justifyContent="center"
            direction={alignment}
            backgroundColor={singleValueBackground}
            border={`${singleValueBorder}px`}
            borderRadius="3px"
            // padding="4px"
            textAlign="center"
            bg={bg}
            flex={1}
            spacing={`${spacing}px`}
            h="100%"
            w="100%"
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
                spacing={`${targetSpacing}px`}
            >
                {targetGraph === "circular" && targetValue && target ? (
                    <CircularProgress
                        value={(value * 100) / targetValue}
                        size={`${radius}px`}
                        thickness={`${thickness}px`}
                        color={targetColor}
                    >
                        <CircularProgressLabel>
                            {((value * 100) / targetValue).toFixed(0)}%
                        </CircularProgressLabel>
                    </CircularProgress>
                ) : targetGraph === "progress" && targetValue && target ? (
                    <Box w="300px">
                        <Progress
                            percent={50}
                            status="active"
                            strokeWidth={thickness}
                        />
                    </Box>
                ) : null}
                <Text
                    fontSize={`${fontSize}vh`}
                    color={color}
                    fontWeight={fontWeight}
                >
                    {prefix}
                    {numberFormatter.format(value)}
                    {suffix}
                </Text>
            </Stack>
        </Stack>
    );
};
export default SingleValue;
