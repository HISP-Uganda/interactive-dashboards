import React from "react";
import { Image } from "@chakra-ui/react";
import { ChartProps } from "../../interfaces";

export default function ImageVisualization({
    dataProperties,
    visualization,
}: ChartProps) {
    const src = dataProperties?.["data.src"];
    const height = visualization.properties["data.height"] || "100";
    const boxSize = visualization.properties["boxSize"] || "100";
    const width = visualization.properties["data.width"] || "100";
    return (
        <Image
            src={src}
            alt="Image preview"
            boxSize={`${boxSize}px`}
            style={{
                objectFit: "contain",
                maxWidth: `${width}%`,
                maxHeight: `${height}%`,
                width: "auto",
                height: "auto",
            }}
        />
    );
}
