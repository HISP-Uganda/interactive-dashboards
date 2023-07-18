import React from "react";
import { ChartProps } from "../../interfaces";
import { Stack, Text } from "@chakra-ui/react";

interface HeatMapProps extends ChartProps {
    category?: string;
    series?: string;
    traces?: string;
}
const HeatMap = ({ }: HeatMapProps) => {
    return <>
        <Text>Show me Something</Text>
    </>;
};

export default HeatMap;
