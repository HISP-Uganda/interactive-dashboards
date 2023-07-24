import React from "react";
import { Stack } from "@chakra-ui/react";
import RadioProperty from "./RadioProperty";
import { IVisualization } from "../../interfaces";
import { createOptions } from "../../utils/utils";

export default function CategoryListProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    return (
        <Stack>
            <RadioProperty
                visualization={visualization}
                options={createOptions(["list", "accordion", "tree"])}
                attribute="type"
                title="Display as"
            />
        </Stack>
    );
}
