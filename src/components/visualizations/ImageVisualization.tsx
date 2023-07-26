import React from "react";
import { ChartProps } from "../../interfaces";

export default function ImageVisualization({ dataProperties }: ChartProps) {
    const src = dataProperties?.["data.src"];
    const height = dataProperties?.["data.height"] || "100";
    const width = dataProperties?.["data.width"] || "100";
    return (
        <img
            src={src}
            alt="Image preview"
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
