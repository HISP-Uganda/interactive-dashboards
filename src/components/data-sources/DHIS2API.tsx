import React from "react";
import { Input, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $visualizationQuery } from "../../Store";
import { datumAPi } from "../../Events";

export default function DHIS2API() {
    const visualizationQuery = useStore($visualizationQuery);
    return (
        <Stack direction="row" alignItems="center">
            <Text>Resource URL</Text>
            <Input
                value={visualizationQuery.query}
                onChange={(e) => {
                    datumAPi.changeAttribute({
                        attribute: "query",
                        value: e.target.value,
                    });
                }}
                flex={1}
            />
        </Stack>
    );
}
