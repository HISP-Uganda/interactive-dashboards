import React from "react";
import { ChartProps } from "../../interfaces";
import { Text } from '@chakra-ui/react'

export default function TextVisualisation({ dataProperties, data }: ChartProps) {
    return (
        <Text>{data}</Text>
    );
}
