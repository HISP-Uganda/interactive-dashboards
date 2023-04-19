import { useStore } from "effector-react";
import React from "react";
import { $dashboard } from "../../Store";
import { Stack, Text } from "@chakra-ui/react";

export default function DashboardTitle() {
    const dashboard = useStore($dashboard);
    return (
        <Stack>
            {dashboard.name && <Text>{dashboard.name}</Text>}
            {dashboard.tag && <Text>{dashboard.tag}</Text>}
        </Stack>
    );
}
