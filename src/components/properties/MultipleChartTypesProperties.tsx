import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";

const MultipleChartTypesProperties = ({
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
        </Stack>
    );
};

export default MultipleChartTypesProperties;
