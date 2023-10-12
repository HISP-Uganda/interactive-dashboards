import { Grid, Image, Stack, Text } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-location";
import Menus from "./Menus";
export default function Settings() {
    return (
        <Grid templateRows="72px 1fr">
            <Stack
                spacing="10px"
                direction="row"
                borderBottomStyle="solid"
                borderBottomColor="blue.600"
                borderBottomWidth="1px"
                justifyItems="center"
                alignItems="center"
            >
                <Image src="./dhis2-app-icon.png" boxSize="72px" ml="20px" />
                <Text fontSize="4xl" color="blue.600" fontWeight="semibold">
                    The Visualization Studio
                </Text>
            </Stack>
            <Grid templateColumns="260px 1fr" h="calc(100vh - 48px - 72px)">
                <Stack p="10px" h="100%">
                    <Menus />
                </Stack>
                <Stack p="10px" w="100%" h="100%">
                    <Stack
                        boxShadow="0 0.5mm 2mm rgba(0, 0, 0, 0.3)"
                        w="100%"
                        h="100%"
                        p="20px"
                        overflow="auto"
                    >
                        <Outlet />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}
