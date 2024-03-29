import { Checkbox, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { isArray, uniq, flatten } from "lodash";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";
const HistogramProperties = ({
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
            <Text>Color</Text>
            <Select<Option, false, GroupBase<Option>>
                value={colors.find((pt) => {
                    if (
                        visualization.properties["color"] &&
                        isArray(visualization.properties["color"])
                    ) {
                        return (
                            visualization.properties["color"].join(",") ===
                            pt.value
                        );
                    }
                    return false;
                })}
                onChange={(e) => {
                    const val = e?.value || "";
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "color",
                        value: val.split(","),
                    });
                }}
                options={colors}
                isClearable
                components={customComponents}
            />

            <Text>Legend</Text>
            <Stack>
                <Text>Orientation</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "orientation",
                            value: e,
                        })
                    }
                    value={visualization.properties["orientation"]}
                >
                    <Stack direction="row">
                        <Radio value="h">Horizontal</Radio>
                        <Radio value="v">Vertical</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>
            <Stack>
                <Text>X-Anchor</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "legendXanchor",
                            value: e,
                        })
                    }
                    value={visualization.properties["legendXanchor"]}
                >
                    <Stack direction="row">
                        <Radio value="auto">Auto</Radio>
                        <Radio value="right">Left</Radio>
                        <Radio value="left">Right</Radio>
                        <Radio value="center">Center</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>

            <Stack>
                <Text>Y-Anchor</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "legendYanchor",
                            value: e,
                        })
                    }
                    value={visualization.properties["legendYanchor"]}
                >
                    <Stack direction="row">
                        <Radio value="auto">Auto</Radio>
                        <Radio value="top">Top</Radio>
                        <Radio value="bottom">Bottom</Radio>
                        <Radio value="middle">Middle</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>
        </Stack>
    );
};

export default HistogramProperties;
