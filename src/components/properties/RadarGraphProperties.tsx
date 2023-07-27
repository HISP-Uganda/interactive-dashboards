import { Checkbox, Input, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { flatten, uniq } from "lodash";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { createOptions } from "../../utils/utils";

const RadarGraphProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = useStore($visualizationData);
    const metadata = useStore($visualizationMetadata)[visualization.id];
    const columns: Option[] = createOptions(
        uniq(
            flatten(
                flatten(visualizationData[visualization.id]).map((d) =>
                    Object.keys(d)
                )
            )
        )
    );

    return (
        <Stack>
            <Checkbox
                isChecked={visualization.showTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.checked);

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

export default RadarGraphProperties;
