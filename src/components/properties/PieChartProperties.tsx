import { Stack, Text, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { flatten, isArray, uniq } from "lodash";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";
import SelectProperty from "./SelectProperty";
import SwitchProperty from "./SwitchProperty";
import Scrollable from "../Scrollable";
import NumberProperty from "./NumberProperty";
import ColorProperty from "./ColorProperty";
import TextProperty from "./TextProperty";

const PieChartProperties = ({
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

    const findUniqValue = (key: string) => {
        return uniq(visualizationData[visualization.id].map((d) => d[key]));
    };

    return (
        <Stack>
            <SelectProperty
                attribute="labels"
                visualization={visualization}
                options={columns}
                title="Labels Column"
            />

            <SwitchProperty
                attribute="summarize"
                visualization={visualization}
                title="Summarize Selected Column"
            />

            {visualization.properties["labels"] && (
                <Scrollable height={300}>
                    <Table variant="unstyled">
                        <Thead>
                            <Tr>
                                <Th>Column</Th>
                                <Th>Width</Th>
                                <Th>BG</Th>
                                <Th>Rename</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {findUniqValue(
                                visualization.properties["labels"]
                            ).map((row) => (
                                <Tr key={row}>
                                    <Td>{row}</Td>
                                    <Td w="50px">
                                        <NumberProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.width`}
                                            min={50}
                                            max={500}
                                            step={1}
                                        />
                                    </Td>
                                    <Td w="50px">
                                        <ColorProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.bg`}
                                        />
                                    </Td>
                                    <Td w="300px">
                                        <TextProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.name`}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Scrollable>
            )}

            <SelectProperty
                attribute="values"
                visualization={visualization}
                options={columns}
                title="Values Column"
            />
            <Text>PieChart Colors</Text>
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
            />
        </Stack>
    );
};

export default PieChartProperties;
