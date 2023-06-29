import React from "react";
import { VizProps } from "../../interfaces";
import Picker from "../Picker";
import { sectionApi } from "../../Events";

export default function ColorProperty({
    attribute,
    visualization,
    title,
    disabled
}: VizProps & { disabled?: boolean }) {
    return (
        <Picker
            color={visualization.properties[attribute]}
            onChange={(color) => {
                sectionApi.changeVisualizationProperties({
                    visualization: visualization.id,
                    attribute: attribute,
                    value: color,
                })
            }
            }
        />
    );
}
