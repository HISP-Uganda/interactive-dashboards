import React from "react";
import { Box } from "@chakra-ui/react";

export default function Scrollable({
    children,
    height,
}: {
    children: React.ReactNode;
    height: number;
}) {
    return (
        <Box h="100%" w="100%">
            <Box
                position="relative"
                overflow="auto"
                h={`${height}px`}
                w="100%"
                whiteSpace="nowrap"
            >
                {children}
            </Box>
        </Box>
    );
}
