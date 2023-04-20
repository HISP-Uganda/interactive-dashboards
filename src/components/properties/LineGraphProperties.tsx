import { Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { isArray } from "lodash";
import { ChangeEvent } from "react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors } from "../../utils/utils";

const LineGraphProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = useStore($visualizationData);
    const columns = visualizationData[visualization.id]
        ? Object.keys(visualizationData[visualization.id][0]).map<Option>(
              (o) => {
                  return { value: o, label: o };
              }
          )
        : [];

    return (
        <Stack>
            <Text>Category</Text>
            <Select<Option, false, GroupBase<Option>>
                value={columns.find(
                    (pt) => pt.value === visualization.properties["category"]
                )}
                onChange={(e) =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "category",
                        value: e?.value,
                    })
                }
                options={columns}
                isClearable
            />
            <Text>Traces</Text>
            <Select<Option, false, GroupBase<Option>>
                value={columns.find(
                    (pt) => pt.value === visualization.properties["series"]
                )}
                onChange={(e) =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "series",
                        value: e?.value,
                    })
                }
                options={columns}
                isClearable
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
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.colorway",
                        value: val.split(","),
                    });
                }}
                options={colors}
                isClearable
                components={customComponents}
            />

            <Text>Legend</Text>
            <Stack>
                <Text>X-Anchor</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "layout.yaxis.title",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
        </Stack>
    );
};

export default LineGraphProperties;
