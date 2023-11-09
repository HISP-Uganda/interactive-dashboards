import {
    Checkbox,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { flatten, isArray, uniq } from "lodash";
import { ChangeEvent } from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import {
    chartTypes,
    colors,
    createOptions,
    findUniqValue,
} from "../../utils/utils";
import Scrollable from "../Scrollable";
import SelectProperty from "./SelectProperty";
import SwitchProperty from "./SwitchProperty";
import TextProperty from "./TextProperty";
import ColorProperty from "./ColorProperty";

const barModes = createOptions(["stack", "group", "overlay", "relative"]);

const BarGraphProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const visualizationData = flatten(
        useStore($visualizationData)[visualization.id] || []
    );
    const metadata = useStore($visualizationMetadata)[visualization.id];
    const columns: Option[] = createOptions(
        uniq(flatten(visualizationData.map((d) => Object.keys(d))))
    );

    const specificValues: string[] = visualization.properties["specific"] || [];

    return (
        <Stack>
            <Checkbox
                isChecked={visualization.showTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    sectionApi.changeVisualizationAttribute({
                        visualization: visualization.id,
                        attribute: "showTitle",
                        value: e.target.checked,
                    });
                }}
            >
                Show Title
            </Checkbox>
            <SwitchProperty
                attribute="summarize"
                visualization={visualization}
                title="Summarize"
            />

            <SelectProperty
                attribute="category"
                visualization={visualization}
                title="Category"
                options={columns}
            />

            {visualization.properties["category"] && (
                <Scrollable height={"300px"}>
                    <Table variant="unstyled">
                        <Thead>
                            <Tr>
                                <Th>Column</Th>
                                <Th>Rename</Th>
                                <Th>Color</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {findUniqValue(
                                visualizationData,
                                visualization.properties["category"]
                            ).map((row) => (
                                <Tr key={row}>
                                    <Td>{row}</Td>
                                    <Td>
                                        <TextProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.name`}
                                        />
                                    </Td>
                                    <Td w="50px">
                                        <ColorProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.bg`}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Scrollable>
            )}
            <SelectProperty
                attribute="series"
                visualization={visualization}
                title="Traces"
                options={columns}
            />

            {visualization.properties["series"] && (
                <Scrollable height={"300px"}>
                    <Table variant="unstyled">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Column</Th>
                                <Th>Rename</Th>
                                <Th>Color</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {findUniqValue(
                                visualizationData,
                                visualization.properties["series"]
                            ).map((row) => (
                                <Tr key={row}>
                                    <Td>
                                        <Checkbox
                                            isChecked={
                                                specificValues.indexOf(row) !==
                                                -1
                                            }
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                if (e.target.checked) {
                                                    sectionApi.changeVisualizationProperties(
                                                        {
                                                            visualization:
                                                                visualization.id,
                                                            attribute:
                                                                "specific",
                                                            value: [
                                                                ...specificValues,
                                                                row,
                                                            ],
                                                        }
                                                    );
                                                } else {
                                                    sectionApi.changeVisualizationProperties(
                                                        {
                                                            visualization:
                                                                visualization.id,
                                                            attribute:
                                                                "specific",
                                                            value: specificValues.filter(
                                                                (i) => i !== row
                                                            ),
                                                        }
                                                    );
                                                }
                                            }}
                                        />
                                    </Td>
                                    <Td>{row}</Td>
                                    <Td w="300px">
                                        <TextProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.name`}
                                        />
                                    </Td>
                                    <Td w="50px">
                                        <ColorProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.bg`}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Scrollable>
            )}
            <Stack direction="row" alignItems="center">
                <SwitchProperty
                    attribute="percentages"
                    visualization={visualization}
                    title="Percentages"
                    direction="row-reverse"
                />
                <SwitchProperty
                    attribute="overall"
                    visualization={visualization}
                    title="Overall"
                    direction="row-reverse"
                />
            </Stack>

            <SelectProperty
                attribute="layout.barmode"
                visualization={visualization}
                title="Bar Mode"
                options={barModes}
            />

            <Stack>
                <Text>Orientation</Text>
                <RadioGroup
                    onChange={(e: string) =>
                        sectionApi.changeVisualizationProperties({
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
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.colorway",
                        value: val.split(","),
                    });
                }}
                options={colors}
                isClearable
                components={customComponents}
                menuPlacement="auto"
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

            {visualization.properties["series"] && (
                <Tabs>
                    <TabList>
                        {uniq(
                            visualizationData.map(
                                (x: any) =>
                                    x[visualization.properties["series"]]
                            )
                        ).map((x) => (
                            <Tab key={x}>{metadata?.[x]}</Tab>
                        ))}
                    </TabList>

                    <TabPanels>
                        {uniq(
                            visualizationData.map(
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
                                            sectionApi.changeVisualizationProperties(
                                                {
                                                    visualization:
                                                        visualization.id,
                                                    attribute: `data.${x}`,
                                                    value: val,
                                                }
                                            );
                                        }}
                                        options={chartTypes}
                                        isClearable
                                        menuPlacement="auto"
                                        size="sm"
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
