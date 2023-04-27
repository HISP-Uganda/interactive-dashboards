import {
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Checkbox,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { isArray, uniq } from "lodash";
import {
    changeVisualizationAttribute,
    changeVisualizationProperties,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { chartTypes, colors, createOptions } from "../../utils/utils";

const barModes = createOptions(["stack", "group", "overlay", "relative"]);

const BarGraphProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = useStore($visualizationData);
    const metadata = useStore($visualizationMetadata)[visualization.id];
    const columns = visualizationData[visualization.id]
        ? Object.keys(visualizationData[visualization.id][0]).map<Option>(
              (o) => {
                  return { value: o, label: o };
              }
          )
        : [];

    return (
        <Stack>
            <Checkbox
                isChecked={visualization.showTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.checked);

                    changeVisualizationAttribute({
                        visualization: visualization.id,
                        attribute: "showTitle",
                        value: e.target.checked,
                    });
                }}
            >
                Show Title
            </Checkbox>
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
                menuPlacement="auto"
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
                menuPlacement="auto"
            />
            <Text>Bar Mode</Text>
            <Select<Option, false, GroupBase<Option>>
                value={barModes.find(
                    (pt) =>
                        pt.value === visualization.properties["layout.barmode"]
                )}
                onChange={(e) =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.barmode",
                        value: e?.value,
                    })
                }
                options={barModes}
                isClearable
                menuPlacement="auto"
            />
            <Stack>
                <Text>Orientation</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.orientation",
                            value: e,
                        })
                    }
                    value={visualization.properties["data.orientation"]}
                >
                    <Stack direction="row">
                        <Radio value="h">Horizontal</Radio>
                        <Radio value="v">Vertical</Radio>
                    </Stack>
                </RadioGroup>
            </Stack>
            <Text>Bar Graph Colors</Text>
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
                menuPlacement="auto"
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

            {visualization.properties["series"] && (
                <Tabs>
                    <TabList>
                        {uniq(
                            visualizationData[visualization.id].map(
                                (x: any) =>
                                    x[visualization.properties["series"]]
                            )
                        ).map((x) => (
                            <Tab key={x}>{metadata?.[x]?.name}</Tab>
                        ))}
                    </TabList>

                    <TabPanels>
                        {uniq(
                            visualizationData[visualization.id].map(
                                (x: any) =>
                                    x[visualization.properties["series"]]
                            )
                        ).map((x) => (
                            <TabPanel key={x}>
                                <Stack>
                                    <Text>Chart Type</Text>
                                    <Select<Option, false, GroupBase<Option>>
                                        value={chartTypes.find(
                                            (pt) =>
                                                visualization.properties[
                                                    `data.${x}`
                                                ] === pt.value
                                        )}
                                        onChange={(e) => {
                                            const val = e?.value || "";
                                            changeVisualizationProperties({
                                                visualization: visualization.id,
                                                attribute: `data.${x}`,
                                                value: val,
                                            });
                                        }}
                                        options={chartTypes}
                                        isClearable
                                        menuPlacement="auto"
                                    />
                                </Stack>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            )}
        </Stack>
    );
};

export default BarGraphProperties;
