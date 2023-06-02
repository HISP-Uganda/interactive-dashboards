import { Input, Stack, Text, Checkbox } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useStore } from "effector-react";
import { Select, GroupBase } from "chakra-react-select";
import { isArray } from "lodash";
import {
    // changeVisualizationAttribute,
    // changeVisualizationProperties,
    sectionApi,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors } from "../../utils/utils";

const GaugeChartProperties = ({
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
    console.log("visualisation:", visualization);

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
            {/* <Text>Value</Text>
            <Select<Option, false, GroupBase<Option>>
                value={columns.find(
                    (pt) => pt.value === visualization.properties["value"]
                )}
                onChange={(e) =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "value",
                        value: e?.value,
                    })
                }
                options={columns}
                isClearable
                menuPlacement="auto"
            /> */}
            <Text>Gauge Color</Text>
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
                menuPlacement="auto"
            />
        </Stack>
    );
};

export default GaugeChartProperties;
