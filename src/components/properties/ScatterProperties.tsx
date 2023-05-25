s
import React, { useEffect, ChangeEvent } from "react";
import { Input, Radio, RadioGroup, Stack, Text, Checkbox } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { GroupBase, Select } from "chakra-react-select";
import { isArray, uniq } from "lodash";
import {
  changeVisualizationAttribute,
  changeVisualizationProperties,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { customComponents } from "../../utils/components";
import { colors, createOptions } from "../../utils/utils";

const ScatterProperties = ({ visualization }: { visualization: IVisualization }) => {
  const visualizationData = useStore($visualizationData);
  const columns = visualizationData[visualization.id]
    ? Object.keys(visualizationData[visualization.id][0]).map<Option>(
        (o) => {
          return { value: o, label: o };
        }
      )
    : [];

  useEffect(() => {
    if (visualizationData && visualizationData[visualization.id]) {
      const initialX = columns[0]?.value;
      const initialY = columns[1]?.value;

      changeVisualizationProperties({
        visualization: visualization.id,
        attribute: "y",
        value: initialY,
      });
    }
  }, []);

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
      {/* <Text>X-Axis</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find((pt) => pt.value === visualization.properties["x"])}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "x",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
        menuPlacement="auto"
      />
      <Text>Y-Axis</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find((pt) => pt.value === visualization.properties["y"])}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "y",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
        menuPlacement="auto"
      />
      <Text>Scatter Colors</Text>
      <Select<Option, false, GroupBase<Option>>
        value={colors.find((pt) => {
          if (
            visualization.properties["color"] &&
            isArray(visualization.properties["color"])
          ) {
            return (
              visualization.properties["color"].join(",") === pt.value
            );
          }
          return false;
        })}
        onChange={(e) => {
          const val = e?.value || "";
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "color",
            value: val.split(","),
          });
        }}
        options={colors}
        isClearable
        components={customComponents}
        menuPlacement="auto"
      /> */}
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

export default ScatterProperties;


     
