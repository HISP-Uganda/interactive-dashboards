import { Input, Stack, Text, Checkbox } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useStore } from "effector-react";
import { Select, GroupBase } from "chakra-react-select";
import { isArray, uniq, flatten } from "lodash";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";

const StackedAreaChartProperties = ({
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
            <Text>Fill Color</Text>
            <Select<Option, false, GroupBase<Option>>
                value={colors.find((pt) => {
                    if (
                        visualization.properties["fillColor"] &&
                        isArray(visualization.properties["fillColor"])
                    ) {
                        return (
                            visualization.properties["fillColor"].join(",") ===
                            pt.value
                        );
                    }
                    return false;
                })}
                onChange={(e) => {
                    const val = e?.value || "";
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "fillColor",
                        value: val.split(","),
                    });
                }}
                options={colors}
                isClearable
                components={customComponents}
                menuPlacement="auto"
            />
        </Stack>
    );
};

export default StackedAreaChartProperties;
