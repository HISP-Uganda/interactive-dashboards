import { Input, Stack, Text, Checkbox } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useStore } from "effector-react";
import { Select, GroupBase } from "chakra-react-select";
import { isArray } from "lodash";
import {
    changeVisualizationAttribute,
    changeVisualizationProperties,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors } from "../../utils/utils";

const RadarGraphProperties = ({ visualization }: { visualization: IVisualization }) => {
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
            <Text>Marker Size</Text>
          <Input
        value={visualization.properties["markerSize"]}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
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

