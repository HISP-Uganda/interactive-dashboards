import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";

const MapChartProperties = ({
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
      <Text>Category</Text>
    </Stack>
  );
};

export default MapChartProperties;
