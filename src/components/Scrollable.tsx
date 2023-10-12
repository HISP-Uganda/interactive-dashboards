import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import type { TypographyProps } from "@chakra-ui/react";
import { useElementSize } from "usehooks-ts";

export default function Scrollable({
    children,
    whiteSpace = "nowrap",
    height,
    width,
}: {
    children: React.ReactNode;
    whiteSpace?: TypographyProps["whiteSpace"];
    height?: string;
    width?: string;
}) {
    const [squareRef, { height: calculatedHeight, width: calculatedWidth }] =
        useElementSize();

    useEffect(() => {
        return () => {};
    }, [calculatedHeight, calculatedWidth]);

    return (
        <Box h="100%" w="100%" ref={squareRef}>
            <Box
                position="relative"
                overflow="auto"
                h={calculatedHeight !== 0 ? `${calculatedHeight}px` : height}
                w={calculatedWidth !== 0 ? `${calculatedWidth}px` : height}
                whiteSpace={whiteSpace}
            >
                {children}
            </Box>
        </Box>
    );
}
