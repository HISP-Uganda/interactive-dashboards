import React from "react";
import { ChartProps } from "../../interfaces";

export default function ImageVisualization({ dataProperties }: ChartProps) {
    const src = dataProperties?.["data.src"];
    return (
        <img
            src={src}
            alt="Image preview"
            style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
            }}
        />
    );
}
