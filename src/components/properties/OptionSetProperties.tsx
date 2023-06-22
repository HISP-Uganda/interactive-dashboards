import React from "react";
import { IVisualization } from "../../interfaces";
import { Stack } from "@chakra-ui/react";
import TextProperty from "./TextProperty";

export default function OptionSetProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    return (
        <Stack>
            <TextProperty
                visualization={visualization}
                title="Option Set"
                attribute="optionSet"
            />
            <TextProperty
                visualization={visualization}
                title="Affected Field"
                attribute="affected"
            />
        </Stack>
    );
}
