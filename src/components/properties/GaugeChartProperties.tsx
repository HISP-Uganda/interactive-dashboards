import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";


const GaugeChartProperties = ({ visualization, }: { visualization: IVisualization }) => {

  const visualizationData = useStore($visualizationData);
    {/*
      mode (gauge+number), align, domain, 
   */}
    return (
      <Stack>

      </Stack>
    )
}

export default GaugeChartProperties;

