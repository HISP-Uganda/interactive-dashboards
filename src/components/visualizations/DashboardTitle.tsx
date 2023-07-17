import { useStore } from "effector-react";
import React from "react";
import { $dashboard } from "../../Store";
import { Stack, Text } from "@chakra-ui/react";

export default function DashboardTitle() {
    const dashboard = useStore($dashboard);
    return (
        <Stack justifyContent="center">
            {dashboard.name && (
                <Text fontSize="4xl" fontWeight="bold" color="blue.400">
                    {dashboard.name}
                </Text>
            )}
            {dashboard.tag && (
                <Text fontSize="2xl" color="blue.400">
                    {dashboard.tag}
                </Text>
            )}
        </Stack>
    );
}
