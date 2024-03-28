import React from "react";
import { Spinner, Stack } from "@chakra-ui/react";

export default function LoadingIndicator() {
    return (
        <Stack alignItems="center" justifyContent="center" flex={1}>
            <Spinner
                thickness="1.8px"
                speed="0.7s"
                // emptyColor="gray.200"
                // color="red"
                size="sm"
            />
        </Stack>
    );
}
