import { Divider, Grid, Stack, Text, Image, Spacer } from "@chakra-ui/react";
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
            <Grid templateColumns="250px 1fr" p="20px">
                <Menus />
                <Outlet />
            </Grid>
        </Grid>
    );
}
