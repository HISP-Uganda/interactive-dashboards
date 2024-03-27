import React from "react";
import { Spinner, Stack } from "@chakra-ui/react";

export default function LoadingIndicator() {
    return (
        <Stack w="100%" h="100%" alignItems="center" justifyContent="center">
            <Spinner
                thickness="2px"
                speed="0.65s"
                // emptyColor="gray.200"
                // color="red"
                size="sm"
            />
        </Stack>
    );
}
