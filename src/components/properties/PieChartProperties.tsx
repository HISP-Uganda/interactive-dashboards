import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { isArray, uniq } from "lodash";
import { $visualizationData } from "../../Store";
import { customComponents } from "../../utils/components";
import { chartTypes, colors, createOptions } from "../../utils/utils";

const PieChartProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const visualizationData = useStore($visualizationData);
  const columns = visualizationData[visualization.id]
    ? Object.keys(visualizationData[visualization.id][0]).map<Option>((o) => {
        return { value: o, label: o };
      })
    : [];

  return (
    <Stack>
      <Text>Labels Column</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find(
          (pt) => pt.value === visualization.properties["labels"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "labels",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
      />
      <Text>Values Column</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find(
          (pt) => pt.value === visualization.properties["values"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "values",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
      />
      <Text>PieChart Colors</Text>
      <Select<Option, false, GroupBase<Option>>
        value={colors.find((pt) => {
          if (
            visualization.properties["layout.colorway"] &&
            isArray(visualization.properties["layout.colorway"])
          ) {
            return (
              visualization.properties["layout.colorway"].join(",") === pt.value
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

    </Stack>
  );
};

export default PieChartProperties;
