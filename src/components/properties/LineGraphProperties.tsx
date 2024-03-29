import { Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { isArray, uniq, flatten } from "lodash";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";

const LineGraphProperties = ({
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
            <Text>Category</Text>
            <Select<Option, false, GroupBase<Option>>
                value={columns.find(
                    (pt) => pt.value === visualization.properties["category"]
                )}
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "category",
                        value: e?.value,
                    })
                }
                options={columns}
                isClearable
                size="sm"
            />
            <Text>Traces</Text>
            <Select<Option, false, GroupBase<Option>>
                value={columns.find(
                    (pt) => pt.value === visualization.properties["series"]
                )}
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "series",
                        value: e?.value,
                    })
                }
                options={columns}
                isClearable
                size="sm"
            />

            <Text>Color scale</Text>
            <Select<Option, false, GroupBase<Option>>
                value={colors.find((pt) => {
                    if (
                        visualization.properties["layout.colorway"] &&
                        isArray(visualization.properties["layout.colorway"])
                    ) {
                        return (
                            visualization.properties["layout.colorway"].join(
                                ","
                            ) === pt.value
                        );
                    }
                    return false;
                })}
                onChange={(e) => {
                    const val = e?.value || "";
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.colorway",
                        value: val.split(","),
                    });
                }}
                options={colors}
                isClearable
                components={customComponents}
                size="sm"
            />

            <Text>Legend</Text>
            <Stack>
                <Text>X-Anchor</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "layout.legend.xanchor",
                            value: e,
                        })
                    }
                    value={visualization.properties["layout.legend.xanchor"]}
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
                            attribute: "layout.legend.yanchor",
                            value: e,
                        })
                    }
                    value={visualization.properties["layout.legend.yanchor"]}
                >
                    <Stack direction="row">
                        <Radio value="auto">Auto</Radio>
                        <Radio value="top">Top</Radio>
                        <Radio value="bottom">Bottom</Radio>
                        <Radio value="middle">Middle</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>

            <Stack>
                <Text>Y-Axis Title</Text>
                <Input
                    value={visualization.properties["layout.yaxis.title"]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "layout.yaxis.title",
                            value: e.target.value,
                        })
                    }
                    size="sm"
                />
            </Stack>
        </Stack>
    );
};

export default LineGraphProperties;
