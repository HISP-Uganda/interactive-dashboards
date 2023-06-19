import React, { useEffect, ChangeEvent } from "react";
import {
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Checkbox,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { GroupBase, Select } from "chakra-react-select";
import { isArray, uniq, flatten } from "lodash";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";

const ScatterProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = useStore($visualizationData);
    const columns: Option[] = createOptions(
        uniq(
            flatten(
                flatten(visualizationData[visualization.id]).map((d) =>
                    Object.keys(d)
                )
            )
        )
    );
    useEffect(() => {
        if (visualizationData && visualizationData[visualization.id]) {
            const initialX = columns[0]?.value;
            const initialY = columns[1]?.value;

            sectionApi.changeVisualizationProperties({
                visualization: visualization.id,
                attribute: "y",
                value: initialY,
            });
        }
    }, []);

    return (
        <Stack>
            <Checkbox
                isChecked={visualization.showTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.persist();
                    sectionApi.changeVisualizationAttribute({
                        visualization: visualization.id,
                        attribute: "showTitle",
                        value: e.target.checked,
                    });
                }}
            >
                Show Title
            </Checkbox>
            <Text>Marker Size</Text>
            <Input
                value={visualization.properties["markerSize"]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "markerSize",
                        value: e.target.value,
                    })
                }
            />
        </Stack>
    );
};

export default ScatterProperties;
