import React from "react";
import { ChartProps } from "../../interfaces";
import { Stack, Text } from "@chakra-ui/react";

export default function ImageVisualization({ dataProperties }: ChartProps) {
    const src = dataProperties?.["data.src"];
    const height = dataProperties?.["data.height"] || "100";
    const width = dataProperties?.["data.width"] || "100";
    return (
        <>
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
            {/* <Stack>
                <Text textTransform="uppercase" fontWeight="bold" fontSize="lg">Office of the President</Text>
                <Text fontWeight="bold" fontSize="lg">The Republic Of Uganda</Text>
            </Stack> */}
        </>
    );
}
