import React, { PointerEvent } from "react";
import { useMachine } from "@xstate/react";
import { panelMachine } from "../panel.machine";
import { Box, Stack, Spacer } from "@chakra-ui/react";
import { assign } from "xstate";

export default function Panel() {
    const [state, send] = useMachine(panelMachine, {
        context: { width: 0, pointerId: null },
        actions: {
            // setPointerCapture: (ctx: any, e: any) => {
            //     e.target.setPointerCapture(e.pointerId);
            // },
            // releasePointerCapture: (ctx: any, e: any) => {
            //     e.target.releasePointerCapture(e.pointerId);
            // },
        },
    });
    return (
        <Stack
            height="calc(100vh - 48px)"
            w="100px"
            minW="20vw"
            // p="1rem"
            color="white"
            bg="#111"
            direction="row"
            boxShadow="0 0.5rem 1rem #003"
        >
            <pre>{JSON.stringify(state.value, null, 2)}</pre>
            <Spacer />
            <Box
                // position="absolute"
                h="100%"
                w="0.25rem"
                bg="red"
                // top="0"
                // right="0"
                onPointerDown={(e: PointerEvent<HTMLDivElement>) =>
                    console.log(e)
                }
                // onPointerMove={send}
                // onPointerUp={send}
                // onPointerCancel={send}
                cursor="ew-resize"
            ></Box>
        </Stack>
    );
}
